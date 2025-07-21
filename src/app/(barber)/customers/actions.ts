'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addCustomerNote(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const barberId = formData.get('barberId') as string;
  const customerId = formData.get('customerId') as string;
  const noteType = formData.get('note_type') as string;
  const content = formData.get('content') as string;

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', barberId)
    .single();

  if (barberError || !barber) {
    console.error('Barber yetkilendirme hatası:', barberError);
    return { message: 'Yetkisiz işlem.' };
  }

  const { error } = await supabase
    .from('customer_notes')
    .insert({
      barber_id: barberId,
      customer_id: customerId,
      note_type: noteType,
      content,
    });

  if (error) {
    console.error('Error adding note:', error);
    return { message: 'Not eklenirken bir hata oluştu.' };
  }

  revalidatePath(`/barber/customers/${customerId}`);
  return { message: 'Not başarıyla eklendi!' };
}
