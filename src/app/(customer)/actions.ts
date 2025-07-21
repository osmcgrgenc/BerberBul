
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CustomerProfileFormValues = {
  name: string;
  email: string;
  phone: string;
};

export async function updateCustomerProfile(prevState: { message: string }, formData: CustomerProfileFormValues) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Kullanıcı bulunamadı.' };
  }

  const { name, email, phone } = formData;

  // Update auth email if changed
  if (user.email !== email) {
    const { error: updateEmailError } = await supabase.auth.updateUser({ email });
    if (updateEmailError) {
      console.error('Error updating user email:', updateEmailError);
      return { message: 'E-posta güncellenirken bir hata oluştu.' };
    }
  }

  // Update customer profile in 'customers' table
  const { error } = await supabase
    .from('customers')
    .update({ name, phone, email })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating customer profile:', error);
    return { message: 'Profil güncellenirken bir hata oluştu.' };
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard');

  return { message: 'Profil başarıyla güncellendi!' };
}
