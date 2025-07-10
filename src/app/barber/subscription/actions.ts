'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function subscribeToPlan(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const planId = formData.get('planId') as string;

  // Gerçek ödeme entegrasyonu burada yapılacak.
  // Şimdilik sadece abonelik durumunu güncelliyoruz.
  const { error } = await supabase
    .from('barbers')
    .update({
      subscription_status: 'active',
      plan_id: planId,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün sonrası
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error subscribing:', error);
    return { message: 'Abonelik işlemi başarısız oldu.' };
  }

  revalidatePath('/barber/subscription');
  return { message: 'Abonelik başarıyla tamamlandı!' };
}
