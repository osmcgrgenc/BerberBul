'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function subscribeToPlan(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
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
    redirect('/barber/subscription?error=subscription_failed');
  }

  revalidatePath('/barber/subscription');
  redirect('/barber/subscription?success=subscribed');
}
