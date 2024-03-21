import { MobileHeader } from '@/components/mobile-header';
import { Sidebar } from '@/components/sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full pt-12 lg:pl-[256px] lg:pt-0">
        <div className="h-full">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
