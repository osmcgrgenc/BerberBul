import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ServicesManager from './_components/ServicesManager';
import { Service } from '@/lib/types';

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: barber, error } = await supabase
    .from('barbers')
    .select(`id, services ( id, name, price, duration_minutes )`)
    .eq('user_id', user.id)
    .single();

  if (error || !barber) {
    console.error('Error fetching barber services:', error);
    return <div>Hizmetler yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ServicesManager initialServices={barber.services as Service[]} barberId={barber.id} />
    </div>
  );
}

