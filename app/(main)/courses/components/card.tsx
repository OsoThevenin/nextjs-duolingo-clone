import { Check } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

type Props = {
  id: number;
  title: string;
  imageSrc: string;
  disabled: boolean;
  active: boolean;
  onClick: (id: number) => void;
};

export const Card = ({
  id,
  title,
  imageSrc,
  disabled,
  active,
  onClick,
}: Props) => {
  return (
    <div
      tabIndex={id}
      role="button"
      onClick={() => onClick(id)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(id)}
      className={cn(
        'h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-56 min-w-52',
        disabled && 'opacity-50 pointer-events-none',
      )}
    >
      <div className="flex min-h-6 w-full items-center justify-end">
        {active && (
          <div className="flex items-center justify-center rounded-md bg-green-600 p-1.5">
            <Check className="size-4 stroke-[4] text-white" />
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        width={93.33}
        height={70}
        className="rounded-lg border object-cover drop-shadow-md"
      />
      <p className="mt-3 text-center font-bold text-neutral-700">{title}</p>
    </div>
  );
};
