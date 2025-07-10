'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createAppointment(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const barberId = formData.get('barberId') as string;
  const serviceId = formData.get('serviceId') as string;
  const appointmentTime = formData.get('appointmentTime') as string;
  const tenantId = formData.get('tenantId') as string;

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

  const { error } = await supabase.from('appointments').insert({
    barber_id: barberId,
    customer_id: customerId,
    service_id: serviceId,
    appointment_time: appointmentTime,
    tenant_id: tenantId, // Tenant ID'yi de ekliyoruz
    status: 'pending',
  });

  if (error) {
    console.error('Error creating appointment:', error);
    return { message: 'Randevu oluşturulurken bir hata oluştu.' };
  }

  revalidatePath(`/berber/${formData.get('barberSlug')}`);
  revalidatePath('/dashboard'); // Müşteri dashboardunu da güncelleyebiliriz

  return { message: 'Randevu başarıyla oluşturuldu!' };
}
