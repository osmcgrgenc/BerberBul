import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WorkingHoursForm } from './_components/WorkingHoursForm';

export default async function WorkingHoursPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (barberError || !barber) {
    console.error('Error fetching barber ID:', barberError);
    return <div>Berber bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const { data: workingHours, error: whError } = await supabase
    .from('working_hours')
    .select('*')
    .eq('barber_id', barber.id);

  if (whError) {
    console.error('Error fetching working hours:', whError);
    return <div>Çalışma saatleri yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Çalışma Saatleri Yönetimi</h1>
      <WorkingHoursForm initialWorkingHours={workingHours || []} barberId={barber.id} />
    </div>
  );
}
