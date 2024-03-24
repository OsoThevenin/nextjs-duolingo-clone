import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

import db from '@/db/drizzle';

import { challengeProgress, courses, units, userProgress } from './schema';

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });
  return data;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getCourseById = cache(async (id: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, id),
    // TODO: Populate lessons and units
  });

  return data;
});

export const getUnits = cache(async () => {
  try {
    const { userId } = await auth();
    const userProgressData = await getUserProgress();

    if (!userId || !userProgressData?.activeCourseId) {
      return [];
    }

    const data = await db.query.units.findMany({
      // eslint-disable-next-line @typescript-eslint/no-shadow
      orderBy: (units, { asc }) => [asc(units.order)],
      where: eq(units.courseId, userProgressData.activeCourseId),
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
          with: {
            challenges: {
              orderBy: (challenges, { asc }) => [asc(challenges.order)],
              with: {
                challengeProgress: {
                  where: eq(challengeProgress.userId, userId),
                },
              },
            },
          },
        },
      },
    });

    const normalizedData = data.map((unit) => {
      const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
        if (lesson.challenges.length === 0) {
          return { ...lesson, completed: false };
        }

        const allCompletedChallenges = lesson.challenges.every((challenge) => {
          return (
            challenge.challengeProgress &&
            challenge.challengeProgress.length > 0 &&
            challenge.challengeProgress.every(
              (progress) => progress.isCompleted,
            )
          );
        });

        return { ...lesson, completed: allCompletedChallenges };
      });

      return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch units');
  }
});
