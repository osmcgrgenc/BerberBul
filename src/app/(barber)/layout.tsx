import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { LayoutDashboard, Calendar, Settings, CreditCard, Clock } from 'lucide-react';

export default async function BarberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirect('/login');
  }
  
  // Kullanıcının rolünün 'barber' olup olmadığını kontrol et
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'barber') {
    return redirect('/unauthorized');
  }

  const barberNavItems = [
    { href: '/barber/dashboard', label: 'Anasayfa', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/barber/appointments', label: 'Randevular', icon: <Calendar className="h-4 w-4" /> },
    { href: '/barber/working-hours', label: 'Çalışma Saatleri', icon: <Clock className="h-4 w-4" /> },
    { href: '/barber/subscription', label: 'Abonelik', icon: <CreditCard className="h-4 w-4" /> },
    { href: '/barber/settings', label: 'Ayarlar', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout navItems={barberNavItems} title="Berber Paneli">
      {children}
    </DashboardLayout>
  );
}
