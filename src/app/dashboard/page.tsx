/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns' // Tarih formatlamak için

interface Appointment {
  id: string;
  appointment_time: string;
  status: string;
  barbers: any; // { name: string } | null yerine any
  services: any; // { name: string } | null yerine any
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Müşteri ID'sini bul
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (customerError || !customerData) {
    // Müşteri profili yoksa oluşturmaya yönlendir veya hata mesajı göster
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome, {user.email}!
          </h2>
          <p className="text-center text-gray-600">
            Your customer profile is not set up yet.
          </p>
          {/* Burada bir profil oluşturma formu veya yönlendirme olabilir */}
        </div>
      </div>
    )
  }

  const customerId = customerData.id

  // Müşterinin randevularını getir
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_time,
      status,
      barbers ( name ),
      services ( name )
    `)
    .eq('customer_id', customerId)
    .order('appointment_time', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to your Dashboard, {user.email}!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your bookings and profile here.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-bold">Your Appointments</h3>
          {appointmentsError && <p className="text-red-500">Error loading appointments: {appointmentsError.message}</p>}
          {!appointments || appointments.length === 0 ? (
            <p>You have no upcoming appointments. <Link href="/search" className="text-blue-600 hover:underline">Book one now!</Link></p>
          ) : (
            <ul className="list-none p-0">
              {appointments.map((appointment: Appointment) => (
                <li key={appointment.id} className="mb-4 border p-4 rounded-lg shadow-sm">
                  <p className="font-semibold">
                    {appointment.barbers?.name} - {appointment.services?.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Date: {format(new Date(appointment.appointment_time), 'PPP p')}
                  </p>
                  <p className={`text-sm font-medium ${appointment.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                    Status: {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profil Yönetimi veya diğer müşteri özellikleri buraya eklenebilir */}
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-bold">Profile Management</h3>
          <p className="text-gray-600">
            Your profile details will appear here.
          </p>
          {/* <Link href="/profile" className="font-medium text-indigo-600 hover:text-indigo-500">
            Edit Profile
          </Link> */}
        </div>
      </div>
    </div>
  )
}