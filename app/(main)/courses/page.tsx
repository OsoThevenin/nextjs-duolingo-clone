import { getCourses, getUserProgress } from '@/db/queries';

import { List } from './components/list';

const CoursesPage = async () => {
  const userProgressPromise = getUserProgress();
  const coursesPromise = getCourses();

  const [courses, userProgress] = await Promise.all([
    coursesPromise,
    userProgressPromise,
  ]);

  return (
    <div className="mx-auto h-full max-w-[912px] px-3">
      <h1 className="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  );
};

export default CoursesPage;
