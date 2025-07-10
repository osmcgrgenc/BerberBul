import React from 'react';
import DashboardNav, { NavItem } from '@/components/organisms/DashboardNav';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Home className="h-6 w-6" />
              <span>BerberBul</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <DashboardNav navItems={navItems} />
          </div>
          <div className="mt-auto p-4">
             <AuthButton />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
           <Link className="lg:hidden flex items-center gap-2 font-semibold" href="/">
              <Home className="h-6 w-6" />
              <span className="sr-only">BerberBul</span>
            </Link>
            <div className="w-full flex-1">
                 <h1 className="text-lg font-semibold">{title}</h1>
            </div>
           <div className="lg:hidden">
             <AuthButton />
           </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
