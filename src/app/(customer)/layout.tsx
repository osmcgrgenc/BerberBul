import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { LayoutDashboard, User, Calendar } from 'lucide-react';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const customerNavItems = [
    { href: '/customer-dashboard', label: 'Anasayfa', icon: <LayoutDashboard /> },
    { href: '/profile', label: 'Profilim', icon: <User /> },
    { href: '/my-appointments', label: 'Randevularım', icon: <Calendar /> },
  ];

  return (
    <DashboardLayout navItems={customerNavItems} title="Müşteri Paneli">
      {children}
    </DashboardLayout>
  );
}
