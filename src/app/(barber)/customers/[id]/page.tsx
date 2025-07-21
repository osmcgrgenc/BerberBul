import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { format } from 'date-fns';
import NoteForm from '../_components/NoteForm';

interface PageProps { params: { id: string } }

export default async function CustomerDetailPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (barberError || !barber) {
    console.error('Error fetching barber ID:', barberError);
    return <div>Berber bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const { data: customer, error: custError } = await supabase
    .from('customers')
    .select('id, name, email, phone')
    .eq('id', params.id)
    .single();

  if (custError || !customer) {
    return notFound();
  }

  const { data: appointments } = await supabase
    .from('appointments')
    .select('appointment_time, services ( name, price )')
    .eq('customer_id', params.id)
    .eq('barber_id', barber.id)
    .order('appointment_time', { ascending: false });

  const { data: notes } = await supabase
    .from('customer_notes')
    .select('*')
    .eq('customer_id', params.id)
    .eq('barber_id', barber.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customer.name}</h1>
      <div className="text-gray-700 dark:text-gray-300">Telefon: {customer.phone}</div>
      <div className="text-gray-700 dark:text-gray-300 mb-4">E-posta: {customer.email}</div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Randevu Geçmişi</h2>
        {appointments && appointments.length > 0 ? (
          <ul className="space-y-2">
            {appointments.map(appt => (
              <li key={appt.appointment_time} className="border rounded p-2">
                {format(new Date(appt.appointment_time), 'dd.MM.yyyy')} - {appt.services.name} (₺{appt.services.price})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Geçmiş randevu bulunamadı.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Notlar</h2>
        {notes && notes.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {notes.map(note => (
              <li key={note.id} className="border rounded p-2">
                <span className="font-medium capitalize">{note.note_type}: </span>
                {note.content}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-4">Henüz not eklenmemiş.</p>
        )}
        <NoteForm barberId={barber.id} customerId={customer.id} />
      </section>
    </div>
  );
}
