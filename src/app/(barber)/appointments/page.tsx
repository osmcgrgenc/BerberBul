import { Appointment } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { updateAppointmentStatus } from './actions';
import { Button } from '@/components/ui/button';
import { StatusFilter } from './_components/StatusFilter';
import ToastMessage from '@/components/molecules/ToastMessage';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function BarberAppointmentsPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: barberData, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (barberError || !barberData) {
    console.error('Error fetching barber ID:', barberError);
    return <div>Berber bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const { success, error, status } = await searchParams;
  const filterStatus = typeof status === 'string' ? status : 'all';

  let query = supabase
    .from('appointments')
    .select(
      `
      *,
      customers ( name, email, phone ),
      services ( name, price, duration_minutes )
      `
    )
    .eq('barber_id', barberData.id);

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  const { data: appointments, error: appointmentsError } = await query.order('appointment_time', { ascending: false });

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
    return <div>Randevular yüklenirken bir hata oluştu.</div>;
  }

  const getMessage = () => {
    if (success === 'updated') {
      return { type: 'success' as const, message: 'Randevu durumu güncellendi!' };
    }
    if (error === 'update_failed') {
      return { type: 'error' as const, message: 'Randevu güncellenirken bir hata oluştu.' };
    }
    return null;
  };

  const message = getMessage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Randevular</h1>
      {message && <ToastMessage type={message.type} message={message.message} />}
      <StatusFilter currentStatus={filterStatus} />
      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment: Appointment) => (
            <div key={appointment.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Müşteri: {appointment.customers.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">Email: {appointment.customers.email}</p>
              <p className="text-gray-600 dark:text-gray-400">Telefon: {appointment.customers.phone}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Hizmet: <span className="font-medium">{appointment.services.name}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Fiyat: <span className="font-medium">₺{appointment.services.price}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Süre: <span className="font-medium">{appointment.services.duration_minutes} dk</span></p>
              <p className="text-gray-700 dark:text-gray-300">Tarih: <span className="font-medium">{format(new Date(appointment.appointment_time), 'dd MMMM yyyy HH:mm', { locale: tr })}</span></p>
              <p className="text-gray-700 dark:text-gray-300">Durum: <span className="font-medium capitalize">{appointment.status}</span></p>

              <div className="mt-4 space-x-2">
                {appointment.status === 'pending' && (
                  <>
                    <form action={updateAppointmentStatus} className="inline">
                      <input type="hidden" name="appointmentId" value={appointment.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <Button type="submit" variant="default">Onayla</Button>
                    </form>
                    <form action={updateAppointmentStatus} className="inline">
                      <input type="hidden" name="appointmentId" value={appointment.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <Button type="submit" variant="destructive">Reddet</Button>
                    </form>
                  </>
                )}
                {appointment.status === 'confirmed' && (
                  <form action={updateAppointmentStatus} className="inline">
                    <input type="hidden" name="appointmentId" value={appointment.id} />
                    <input type="hidden" name="status" value="completed" />
                    <Button type="submit" variant="default">Tamamlandı Olarak İşaretle</Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Henüz gelen bir randevunuz bulunmamaktadır.</p>
      )}
    </div>
  );
}
