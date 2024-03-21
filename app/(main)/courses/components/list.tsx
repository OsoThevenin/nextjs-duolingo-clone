'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { upsertUserProgress } from '@/actions/user-progress';
import type { courses, userProgress } from '@/db/schema';

import { Card } from './card';

type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      router.push('/learn');
      return;
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => {
        toast.error('Something went wrong. Please try again.');
      });
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          disabled={pending}
          active={course.id === activeCourseId}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
