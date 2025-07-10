import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { LayoutDashboard, Calendar, Settings } from 'lucide-react';

export default async function BarberLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }
  
  // Burada ek olarak kullanıcının rolünün 'barber' olup olmadığını da kontrol edebiliriz.
  // const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (error || !profile || profile.role !== 'barber') {
  //   return redirect('/unauthorized'); 
  // }

  const barberNavItems = [
    { href: '/barber/dashboard', label: 'Anasayfa', icon: <LayoutDashboard /> },
    { href: '/barber/appointments', label: 'Randevular', icon: <Calendar /> },
    { href: '/barber/settings', label: 'Ayarlar', icon: <Settings /> },
  ];

  return (
    <DashboardLayout navItems={barberNavItems} title="Berber Paneli">
      {children}
    </DashboardLayout>
  );
}
