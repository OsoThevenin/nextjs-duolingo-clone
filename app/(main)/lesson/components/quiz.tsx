/* eslint-disable unused-imports/no-unused-vars */

'use client';

import { useState } from 'react';

import type { challengeOptions, challenges } from '@/db/schema';

import { Header } from './header';

type QuizProps = {
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    isCompleted: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialHearts: number;
  initialPercentage: number;
  userSubscription: any;
};

export const Quiz = ({
  initialLessonId,
  initialHearts,
  initialPercentage,
  initialLessonChallenges,
  userSubscription,
}: QuizProps) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <Header
      hearts={hearts}
      percentage={percentage}
      hasActiveSubscription={!!userSubscription?.isActive}
    />
  );
};
