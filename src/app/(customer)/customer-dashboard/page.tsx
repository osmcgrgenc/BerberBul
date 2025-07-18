/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createClient } from '@/lib/supabase/client' // server yerine client
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Heart, User } from 'lucide-react'
import { useState, useEffect } from 'react' // useState ve useEffect import edildi
import { toast } from 'sonner'

interface Appointment {
  id: string;
  appointment_time: string;
  status: string;
  barbers: any;
  services: any;
}

export default function DashboardPage() { // async kaldırıldı
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [customerData, setCustomerData] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentsError, setAppointmentsError] = useState<any>(null); // Hata state'i eklendi
  const [loading, setLoading] = useState(true)

  // Mock data for recently visited barbers
  const recentBarbers = [
    { id: '1', name: 'Modern Cuts', slug: 'modern-cuts' },
    { id: '2', name: 'Classic Shave', slug: 'classic-shave' },
    { id: '3', name: 'The Gentlemens Barbershop', slug: 'the-gentlemens-barbershop' },
  ];

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        redirect('/login')
        return
      }

      // Müşteri ID'sini bul
      const { data: customerProfile, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (customerError || !customerProfile) {
        // Müşteri profili yoksa oluşturmaya yönlendir veya hata mesajı göster
        setLoading(false)
        return // Yönlendirme veya hata mesajı gösterimi için
      }
      setCustomerData(customerProfile)

      const customerId = customerProfile.id

      // Müşterinin randevularını getir
      const { data: appointmentsData, error: fetchedAppointmentsError } = await supabase // Değişken adı değiştirildi
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

      if (fetchedAppointmentsError) {
        setAppointmentsError(fetchedAppointmentsError); // State'e kaydet
        toast.error(fetchedAppointmentsError.message || "Randevu yüklenirken bir hata oluştu!");
      } else {
        setAppointments(appointmentsData || [])
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>
  }

  if (!user || !customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-6 rounded-2xl shadow-soft bg-card">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Welcome, {user?.email}!
          </h2>
          <p className="text-center text-muted-foreground">
            Your customer profile is not set up yet.
          </p>
          {/* Burada bir profil oluşturma formu veya yönlendirme olabilir */}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigasyon */}
      <aside className="w-full md:w-64 bg-card p-6 rounded-2xl shadow-soft">
        <h3 className="text-xl font-bold mb-6">Dashboard</h3>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/customer-dashboard" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <Calendar size={20} /> Bookings
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/favorites" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <Heart size={20} /> Favorites
              </Link>
            </li>
            <li>
              <Link href="/customer-dashboard/profile" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <User size={20} /> Profile
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 space-y-8">
        {/* Yaklaşan Randevular */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
          {appointmentsError && <p className="text-destructive">Error loading appointments: {appointmentsError.message}</p>}
          {!appointments || appointments.length === 0 ? (
            <p className="text-muted-foreground">You have no upcoming appointments. <Link href="/search" className="text-primary hover:underline">Book one now!</Link></p>
          ) : (
            <ul className="list-none p-0">
              {appointments.map((appointment: Appointment) => (
                <li key={appointment.id} className="mb-4 p-4 rounded-lg shadow-soft bg-background">
                  <p className="font-semibold text-foreground">
                    {appointment.barbers?.name} - {appointment.services?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Date: {format(new Date(appointment.appointment_time), 'PPP p')}
                  </p>
                  <p className={`text-sm font-medium ${appointment.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                    Status: {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Hızlı İşlemler */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/search" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft text-center transition duration-300">
              Yeni Randevu Al
            </Link>
            <Link href="/favorites" className="inline-block bg-secondary hover:bg-secondary-dark text-foreground font-bold py-2 px-4 rounded-2xl shadow-soft text-center transition duration-300">
              Favori Berberlerim
            </Link>
          </div>
        </section>

        {/* Son Ziyaret Edilen Berberler */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Son Ziyaret Edilen Berberler</h2>
          {recentBarbers.length > 0 ? (
            <ul className="list-none p-0 space-y-2">
              {recentBarbers.map(barber => (
                <li key={barber.id}>
                  <Link href={`/berber/${barber.slug}`} className="text-primary hover:underline">
                    {barber.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Henüz ziyaret ettiğiniz bir berber bulunmamaktadır.</p>
          )}
        </section>

        {/* Profil Yönetimi */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Profil Yönetimi</h2>
          <p className="text-muted-foreground">
            Profil detaylarınızı ve ayarlarınızı buradan düzenleyebilirsiniz.
          </p>
          <Link href="/profile" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft transition duration-300">
            Profili Düzenle
          </Link>
        </section>
      </main>
    </div>
  )
}