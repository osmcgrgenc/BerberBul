'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateAppointmentStatus(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const appointmentId = formData.get('appointmentId') as string;
  const status = formData.get('status') as string;

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) {
    console.error('Error updating appointment status:', error);
    return { message: 'Randevu durumu güncellenirken bir hata oluştu.' };
  }

  revalidatePath('/barber/appointments');
  revalidatePath('/dashboard'); // Müşteri dashboardunu da güncelleyebiliriz

  return { message: 'Randevu durumu başarıyla güncellendi!' };
}
