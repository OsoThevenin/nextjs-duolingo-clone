import { Infinity, X } from 'lucide-react';
import Image from 'next/image';

import { Progress } from '@/components/ui/progress';

type HeaderProps = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: HeaderProps) => {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-5 lg:pt-12">
      <X
        onClick={() => {}}
        className="cursor-pointer text-slate-500 transition hover:opacity-75"
      />
      <Progress value={percentage} />

      <div className="flex items-center font-bold text-rose-500">
        <Image
          src="/heart.svg"
          height={28}
          width={28}
          alt="Heart logo"
          className="mr-2"
        />
        {hasActiveSubscription ? (
          <Infinity className="size-6 stroke-[2]" />
        ) : (
          hearts
        )}
      </div>
    </div>
  );
};
