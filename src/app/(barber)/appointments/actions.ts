'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function notifyCustomer(email: string, status: string) {
  // TODO: Replace with real email sending logic
  console.log(`Notify ${email} about appointment status: ${status}`);
}

export async function updateAppointmentStatus(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const appointmentId = formData.get('appointmentId') as string;
  const status = formData.get('status') as string;

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) {
    console.error('Error updating appointment status:', error);
    redirect('/barber/appointments?error=update_failed');
  }

  // Fetch customer email for notification
  const { data: appointment } = await supabase
    .from('appointments')
    .select('customers ( email )')
    .eq('id', appointmentId)
    .single();

  const customerEmail = appointment?.customers?.email;
  if (customerEmail) {
    await notifyCustomer(customerEmail, status);
  }

  revalidatePath('/barber/appointments');
  revalidatePath('/dashboard');

  redirect('/barber/appointments?success=updated');
}
