'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function respondReview(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Yetkisiz erişim.' };
  }

  const reviewId = formData.get('reviewId') as string;
  const response = formData.get('response') as string;

  if (!reviewId || !response) {
    return { message: 'Yanıt boş olamaz.' };
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id, slug')
    .eq('user_id', user.id)
    .single();

  if (barberError || !barber) {
    console.error('Error fetching barber:', barberError);
    return { message: 'Berber bulunamadı.' };
  }

  const { error } = await supabase
    .from('review_responses')
    .upsert({
      review_id: reviewId,
      barber_id: barber.id,
      response_text: response,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'review_id' });

  if (error) {
    console.error('Error saving response:', error);
    return { message: 'Yanıt kaydedilirken bir hata oluştu.' };
  }

  revalidatePath('/barber/reviews');
  if (barber.slug) {
    revalidatePath(`/barber/${barber.slug}`);
  }

  return { message: 'Yanıt başarıyla kaydedildi!' };
}
