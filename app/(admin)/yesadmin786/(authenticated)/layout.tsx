import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopNav } from '@/components/admin/AdminTopNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminTopNav />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden bg-bg-base relative">
          <div className="absolute inset-0 bg-brand/5 blur-[120px] pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
