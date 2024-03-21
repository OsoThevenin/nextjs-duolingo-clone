import { MobileSidebar } from '@/components/mobile-sidebar';

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-12 w-full items-center border-b bg-green-400 px-6 lg:hidden">
      <MobileSidebar />
    </nav>
  );
};
