'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addFavorite(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const barberSlug = formData.get('barberSlug') as string;

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    redirect(`/barber/${barberSlug}?error=favorite-failed`);
  }

  const { error } = await supabase
    .from('customer_favorites')
    .insert({ barber_id: barberId, customer_id: customerData.id });

  if (error) {
    console.error('Error adding favorite:', error);
    redirect(`/barber/${barberSlug}?error=favorite-failed`);
  }

  revalidatePath(`/barber/${barberSlug}`);
  revalidatePath('/favorites');

  redirect(`/barber/${barberSlug}?success=favorite-added`);
}

export async function removeFavorite(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const barberSlug = formData.get('barberSlug') as string | null;
  const redirectTo = formData.get('redirectTo') as string | null;

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    if (redirectTo) {
      redirect(`${redirectTo}?error=favorite-failed`);
    }
    redirect(`/barber/${barberSlug}?error=favorite-failed`);
  }

  const { error } = await supabase
    .from('customer_favorites')
    .delete()
    .eq('barber_id', barberId)
    .eq('customer_id', customerData.id);

  if (error) {
    console.error('Error removing favorite:', error);
    if (redirectTo) {
      redirect(`${redirectTo}?error=favorite-failed`);
    }
    redirect(`/barber/${barberSlug}?error=favorite-failed`);
  }

  if (barberSlug) {
    revalidatePath(`/barber/${barberSlug}`);
  }
  revalidatePath('/favorites');

  if (redirectTo) {
    redirect(`${redirectTo}?success=favorite-removed`);
  }

  redirect(`/barber/${barberSlug}?success=favorite-removed`);
}
