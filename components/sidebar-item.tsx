'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

type Props = {
  label: string;
  href: string;
  iconSrc: string;
};

export const SidebarItem = ({ label, href, iconSrc }: Props) => {
  const path = usePathname();
  const active = path === href;
  return (
    <Button
      variant={active ? 'sidebarOutline' : 'sidebar'}
      className="h-12 justify-start"
      asChild
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          height={32}
          width={32}
          alt={label}
          className="mr-4"
        />
        {label}
      </Link>
    </Button>
  );
};
