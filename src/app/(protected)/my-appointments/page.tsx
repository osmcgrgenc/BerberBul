import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ReviewForm } from '@/components/molecules/ReviewForm';

export default async function MyAppointmentsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    return <div>Müşteri bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select(
      `
      *,
      barbers ( id, name, address, slug ),
      services ( name, price, duration_minutes ),
      reviews ( id )
      `
    )
    .eq('customer_id', customerData.id)
    .order('appointment_time', { ascending: false });

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
    return <div>Randevular yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Randevularım</h1>
      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment: any) => (
            <div key={appointment.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{appointment.barbers.name}</h2>
              <p className="text-gray-600">{appointment.barbers.address}</p>
              <p className="mt-2">Hizmet: <span className="font-medium">{appointment.services.name}</span></p>
              <p>Fiyat: <span className="font-medium">₺{appointment.services.price}</span></p>
              <p>Süre: <span className="font-medium">{appointment.services.duration_minutes} dk</span></p>
              <p>Tarih: <span className="font-medium">{format(new Date(appointment.appointment_time), 'dd MMMM yyyy HH:mm', { locale: tr })}</span></p>
              <p>Durum: <span className="font-medium capitalize">{appointment.status}</span></p>

              {appointment.status === 'completed' && appointment.reviews.length === 0 && (
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Bu randevuyu değerlendir</h3>
                  <ReviewForm barberId={appointment.barbers.id} appointmentId={appointment.id} />
                </div>
              )}
              {appointment.status === 'completed' && appointment.reviews.length > 0 && (
                <p className="mt-4 text-green-600">Bu randevu için yorumunuz gönderildi.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Henüz bir randevunuz bulunmamaktadır.</p>
      )}
    </div>
  );
}
