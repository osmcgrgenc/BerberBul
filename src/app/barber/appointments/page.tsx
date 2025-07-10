import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { updateAppointmentStatus } from './actions'; // Bir sonraki adımda oluşturulacak
import { Button } from '@/components/ui/button';

export default async function BarberAppointmentsPage() {
  const supabase = createClient();

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

  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select(
      `
      *,
      customers ( name, email, phone ),
      services ( name, price, duration_minutes )
      `
    )
    .eq('barber_id', barberData.id)
    .order('appointment_time', { ascending: false });

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
    return <div>Randevular yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gelen Randevular</h1>
      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment: any) => (
            <div key={appointment.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Müşteri: {appointment.customers.name}</h2>
              <p className="text-gray-600">Email: {appointment.customers.email}</p>
              <p className="text-gray-600">Telefon: {appointment.customers.phone}</p>
              <p className="mt-2">Hizmet: <span className="font-medium">{appointment.services.name}</span></p>
              <p>Fiyat: <span className="font-medium">₺{appointment.services.price}</span></p>
              <p>Süre: <span className="font-medium">{appointment.services.duration_minutes} dk</span></p>
              <p>Tarih: <span className="font-medium">{format(new Date(appointment.appointment_time), 'dd MMMM yyyy HH:mm', { locale: tr })}</span></p>
              <p>Durum: <span className="font-medium capitalize">{appointment.status}</span></p>

              <div className="mt-4 space-x-2">
                {appointment.status === 'pending' && (
                  <form action={updateAppointmentStatus}>
                    <input type="hidden" name="appointmentId" value={appointment.id} />
                    <input type="hidden" name="status" value="confirmed" />
                    <Button type="submit" variant="default">Onayla</Button>
                    <input type="hidden" name="status" value="cancelled" />
                    <Button type="submit" variant="destructive">Reddet</Button>
                  </form>
                )}
                {appointment.status === 'confirmed' && (
                  <form action={updateAppointmentStatus}>
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
        <p className="text-gray-600">Henüz gelen bir randevunuz bulunmamaktadır.</p>
      )}
    </div>
  );
}
