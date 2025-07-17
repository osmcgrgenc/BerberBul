'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardNavProps {
  navItems: NavItem[];
}

export default function DashboardNav({ navItems }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
              {
                'bg-accent text-accent-foreground shadow-sm': isActive,
                'text-muted-foreground': !isActive,
              }
            )}
          >
            <span className={cn(
              'transition-colors',
              {
                'text-primary': isActive,
                'text-muted-foreground': !isActive,
              }
            )}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
