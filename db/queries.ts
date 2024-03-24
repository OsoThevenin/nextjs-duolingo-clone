import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

import db from '@/db/drizzle';

import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
} from './schema';

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
      orderBy: (_units, { asc }) => [asc(_units.order)],
      where: eq(units.courseId, userProgressData.activeCourseId),
      with: {
        lessons: {
          orderBy: (_lessons, { asc }) => [asc(_lessons.order)],
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
          return { ...lesson, isCompleted: false };
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

        return { ...lesson, isCompleted: allCompletedChallenges };
      });

      return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch units');
  }
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgressData = await getUserProgress();

  if (!userId || !userProgressData?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (_units, { asc }) => [asc(_units.order)],
    where: eq(units.courseId, userProgressData.activeCourseId),
    with: {
      lessons: {
        orderBy: (_lessons, { asc }) => [asc(_lessons.order)],
        with: {
          unit: true,
          challenges: {
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

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) =>
      lesson.challenges.some(
        (challenge) =>
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((progress) => !progress.isCompleted),
      ),
    );

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.isCompleted);

    return { ...challenge, isCompleted: completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLesson) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.isCompleted,
  );

  return (
    Math.round(completedChallenges.length / lesson.challenges.length) * 100
  );
});
