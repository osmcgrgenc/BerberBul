'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateBarberProfile(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const bio = formData.get('bio') as string;
  const category = formData.get('category') as string;

  const { data: updatedBarber, error } = await supabase
    .from('barbers')
    .update({ bio, category })
    .eq('user_id', user.id)
    .select('slug')
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { message: 'Profil güncellenirken bir hata oluştu.' };
  }

  if (updatedBarber?.slug) {
    revalidatePath(`/berber/${updatedBarber.slug}`);
  }
  revalidatePath('/barber/settings');

  return { message: 'Profil başarıyla güncellendi!' };
}
