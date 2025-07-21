'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function cancelAppointment(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const appointmentId = formData.get('appointmentId') as string;

  // Verify that the user owns this appointment
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    redirect('/my-appointments?error=unauthorized');
  }

  const { data: appointment, error: fetchAppointmentError } = await supabase
    .from('appointments')
    .select('customer_id')
    .eq('id', appointmentId)
    .single();

  if (fetchAppointmentError || !appointment || appointment.customer_id !== customerData.id) {
    console.error('Error fetching appointment or unauthorized:', fetchAppointmentError);
    redirect('/my-appointments?error=not-found');
  }

  // Update the appointment status to 'cancelled'
  const { error: updateError } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId);

  if (updateError) {
    console.error('Error cancelling appointment:', updateError);
    redirect('/my-appointments?error=update-failed');
  }

  revalidatePath('/my-appointments');
  revalidatePath('/dashboard');

  redirect('/my-appointments?success=cancelled');
}

export async function createReview(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Kullanıcı bulunamadı.' };
  }

  const barberId = formData.get('barberId') as string;
  const appointmentId = formData.get('appointmentId') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  if (!barberId || !appointmentId || !rating) {
    return { message: 'Gerekli bilgiler eksik.' };
  }

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

  const { data: barberData } = await supabase
    .from('barbers')
    .select('slug')
    .eq('id', barberId)
    .single();

  // Review'ı veritabanına kaydet
  const { error } = await supabase
    .from('reviews')
    .insert({
      barber_id: barberId,
      customer_id: customerData.id,
      appointment_id: appointmentId,
      rating,
      comment,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error creating review:', error);
    return { message: 'Yorum kaydedilirken bir hata oluştu.' };
  }

  revalidatePath('/my-appointments');
  if (barberData?.slug) {
    revalidatePath(`/barber/${barberData.slug}`);
  }

  return { message: 'Yorumunuz başarıyla kaydedildi!' };
}