import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { CurrencyProvider } from '@/components/CurrencyProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Invera Capital | Institutional Fintech',
  description: 'Premium Institutional Wealth Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="bg-bg-base text-text-primary min-h-screen flex antialiased" suppressHydrationWarning>
        <CurrencyProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden">
              {children}
            </main>
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}

