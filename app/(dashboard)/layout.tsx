import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { getCurrentUser } from '@/lib/auth';

import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/logout');

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNav initialUser={user} />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}

