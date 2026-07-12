import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}

