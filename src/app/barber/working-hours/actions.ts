'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateWorkingHours(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const updates = [];

  for (const day of daysOfWeek) {
    const startTime = formData.get(`${day}_start_time`) as string;
    const endTime = formData.get(`${day}_end_time`) as string;

    if (startTime && endTime) {
      updates.push({
        barber_id: barberId,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
      });
    }
  }

  // Önce mevcut çalışma saatlerini sil
  const { error: deleteError } = await supabase
    .from('working_hours')
    .eq('barber_id', barberId)
    .delete();

  if (deleteError) {
    console.error('Error deleting existing working hours:', deleteError);
    return { message: 'Çalışma saatleri güncellenirken bir hata oluştu.' };
  }

  // Yeni çalışma saatlerini ekle
  const { error: insertError } = await supabase
    .from('working_hours')
    .insert(updates);

  if (insertError) {
    console.error('Error inserting new working hours:', insertError);
    return { message: 'Çalışma saatleri güncellenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/working-hours');
  // Ayrıca berberin herkese açık profil sayfasını da revalidate edebiliriz.
  // revalidatePath(`/berber/${barberSlug}`); 

  return { message: 'Çalışma saatleri başarıyla güncellendi!' };
}
