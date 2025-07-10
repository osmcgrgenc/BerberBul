'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createReview(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const appointmentId = formData.get('appointmentId') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  // Müşteri ID'sini al
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    return { message: 'Müşteri bilgileri alınamadı.' };
  }

  const customerId = customerData.id;

  const { error } = await supabase.from('reviews').insert({
    barber_id: barberId,
    customer_id: customerId,
    appointment_id: appointmentId,
    rating,
    comment,
  });

  if (error) {
    console.error('Error creating review:', error);
    return { message: 'Yorum gönderilirken bir hata oluştu.' };
  }

  revalidatePath('/my-appointments');
  revalidatePath(`/berber/${barberId}`); // Berberin profil sayfasını da güncelleyebiliriz

  return { message: 'Yorumunuz başarıyla gönderildi!' };
}
