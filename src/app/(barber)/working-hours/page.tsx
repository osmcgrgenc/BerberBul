import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WorkingHoursForm } from './_components/WorkingHoursForm';

interface WorkingHour {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_closed: boolean; // Yeni alan
}

export default async function WorkingHoursPage() {
  const supabase = await createClient();

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

  // Supabase'den gelen veride is_closed alanı olmayabilir, bu yüzden varsayılan olarak false atıyoruz.
  const initialWorkingHoursWithClosed = workingHours?.map(wh => ({
    ...wh,
    is_closed: (wh as WorkingHour).is_closed || false, // is_closed alanı yoksa false varsay
  })) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Çalışma Saatleri Yönetimi</h1>
      <WorkingHoursForm initialWorkingHours={initialWorkingHoursWithClosed} barberId={barber.id} />
    </div>
  );
}