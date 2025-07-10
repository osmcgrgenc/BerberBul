import { FC, ReactNode } from "react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  children: ReactNode;
}

const NavItem: FC<NavItemProps> = ({ href, children }) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
  >
    {children}
  </Link>
);

export default NavItem; 