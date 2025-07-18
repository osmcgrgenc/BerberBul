
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface WorkingHourData {
  day_of_week: string;
  start_time: string | null;
  end_time: string | null;
  is_closed: boolean;
}

export async function updateWorkingHours(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const updates: WorkingHourData[] = [];

  for (const day of daysOfWeek) {
    const startTime = formData.get(`${day}_start_time`) as string | null;
    const endTime = formData.get(`${day}_end_time`) as string | null;
    const isClosed = formData.get(`${day}_is_closed`) === 'on';

    updates.push({
      day_of_week: day,
      start_time: isClosed ? null : startTime,
      end_time: isClosed ? null : endTime,
      is_closed: isClosed,
    });
  }

  // Önce mevcut çalışma saatlerini sil
  const { error: deleteError } = await supabase
    .from('working_hours')
    .delete()
    .eq('barber_id', barberId);

  if (deleteError) {
    console.error('Error deleting existing working hours:', deleteError);
    return { message: 'Çalışma saatleri güncellenirken bir hata oluştu.' };
  }

  // Yeni çalışma saatlerini ekle
  const { error: insertError } = await supabase
    .from('working_hours')
    .insert(updates.map(wh => ({ ...wh, barber_id: barberId })));

  if (insertError) {
    console.error('Error inserting new working hours:', insertError);
    return { message: 'Çalışma saatleri güncellenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/working-hours');
  // Ayrıca berberin herkese açık profil sayfasını da revalidate edebiliriz.
  // revalidatePath(`/berber/${barberSlug}`); 

  return { message: 'Çalışma saatleri başarıyla güncellendi!' };
}

interface UnavailableDateData {
  unavailable_date: string;
}

export async function updateUnavailableDates(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const dates = formData.getAll('unavailable_dates') as string[];

  const { error: deleteError } = await supabase
    .from('unavailable_dates')
    .delete()
    .eq('barber_id', barberId);

  if (deleteError) {
    console.error('Error deleting unavailable dates:', deleteError);
    return { message: 'Özel günler güncellenirken bir hata oluştu.' };
  }

  if (dates.length > 0) {
    const insertData: UnavailableDateData[] = dates.map(date => ({ unavailable_date: date }));
    const { error: insertError } = await supabase
      .from('unavailable_dates')
      .insert(insertData.map(d => ({ ...d, barber_id: barberId })));

    if (insertError) {
      console.error('Error inserting unavailable dates:', insertError);
      return { message: 'Özel günler güncellenirken bir hata oluştu.' };
    }
  }

  revalidatePath('/barber/working-hours');
  return { message: 'Özel günler başarıyla güncellendi!' };
}

