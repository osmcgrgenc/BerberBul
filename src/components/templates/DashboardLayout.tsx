import React from 'react';
import DashboardNav, { NavItem } from '@/components/organisms/DashboardNav';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';
import { Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Home className="h-6 w-6" />
              <span className="text-lg">BerberBul</span>
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

      {/* Mobile Header */}
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-full flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link className="flex items-center gap-2 font-semibold" href="/">
                    <Home className="h-6 w-6" />
                    <span className="text-lg">BerberBul</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <DashboardNav navItems={navItems} />
                </div>
                <div className="mt-auto p-4">
                  <AuthButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          <div className="lg:hidden">
            <AuthButton />
          </div>
        </header>
        
        <main id="content" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
