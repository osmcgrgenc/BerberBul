import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface AppointmentRow {
  customer_id: string;
  appointment_time: string;
  services: { price: number };
  customers: { id: string; name: string; phone: string }[];
}

export default async function CustomersPage() {
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

  const { data: rows, error: rowsError } = await supabase
    .from('appointments')
    .select('customer_id, appointment_time, services ( price ), customers ( id, name, phone )')
    .eq('barber_id', barber.id);

  if (rowsError) {
    console.error('Error fetching customers:', rowsError);
    return <div>Müşteriler yüklenirken bir hata oluştu.</div>;
  }

  const map = new Map<string, { id: string; name: string; phone: string; last: string; total: number }>();

  rows?.forEach((row: AppointmentRow) => {
    const cust = row.customers[0];
    if (!cust) return;
    if (!map.has(cust.id)) {
      map.set(cust.id, { id: cust.id, name: cust.name, phone: cust.phone, last: row.appointment_time, total: row.services.price });
    } else {
      const obj = map.get(cust.id)!;
      if (new Date(row.appointment_time) > new Date(obj.last)) obj.last = row.appointment_time;
      obj.total += row.services.price;
      map.set(cust.id, obj);
    }
  });

  const customers = Array.from(map.values()).sort((a,b) => new Date(b.last).getTime() - new Date(a.last).getTime());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Müşterilerim</h1>
      {customers.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Henüz randevu oluşturmuş müşteriniz bulunmamaktadır.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold">İsim</th>
              <th className="px-3 py-2 text-left text-sm font-semibold">Telefon</th>
              <th className="px-3 py-2 text-left text-sm font-semibold">Son Ziyaret</th>
              <th className="px-3 py-2 text-left text-sm font-semibold">Toplam Harcama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <Link href={`/barber/customers/${c.id}`}>{c.name}</Link>
                </td>
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{c.phone}</td>
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{format(new Date(c.last), 'dd.MM.yyyy')}</td>
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">₺{c.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
