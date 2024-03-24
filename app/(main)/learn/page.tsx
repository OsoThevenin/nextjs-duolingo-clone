import { redirect } from 'next/navigation';

import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from '@/db/queries';

import { Header } from './components/header';
import { Unit } from './components/unit';

const LearnPage = async () => {
  const userProgressPromise = getUserProgress();
  const unitsPromise = getUnits();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      userProgressPromise,
      unitsPromise,
      courseProgressPromise,
      lessonPercentagePromise,
    ]);

  if (!userProgress || !userProgress.activeCourse || !courseProgress)
    redirect('/courses');

  return (
    <div className="flex flex-row-reverse gap-12 px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
