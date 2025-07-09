/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Calendar, Image, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Appointment {
  id: string;
  appointment_time: string;
  status: string;
  services: any;
  customers: any;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function BarberDashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [barberProfile, setBarberProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        redirect('/login')
        return
      }

      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (barberError || !barberData) {
        setLoading(false)
        return
      }
      setBarberProfile(barberData)

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_time,
          status,
          services ( name ),
          customers ( name )
        `)
        .eq('barber_id', barberData.id)
        .order('appointment_time', { ascending: false })

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError)
      } else {
        setAppointments(appointmentsData || [])
      }

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('barber_id', barberData.id)

      if (servicesError) {
        console.error('Error fetching services:', servicesError)
      } else {
        setServices(servicesData || [])
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>
  }

  if (!user || !barberProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-6 rounded-2xl shadow-soft bg-card">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Access Denied
          </h2>
          <p className="text-center text-muted-foreground">
            You must be logged in as a barber to access this page.
          </p>
          <div className="text-center">
            <Link href="/login" className="text-primary hover:underline">Go to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigasyon */}
      <aside className="w-full md:w-64 bg-card p-6 rounded-2xl shadow-soft">
        <h3 className="text-xl font-bold mb-6">Barber Dashboard</h3>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/admin" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <Calendar size={20} /> Overview
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/services" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <DollarSign size={20} /> Services
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/hours" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <Clock size={20} /> Working Hours
              </Link>
            </li>
            <li>
              <Link href="/admin/gallery" className="flex items-center gap-3 text-foreground hover:text-primary font-medium">
                <Image size={20} /> Gallery
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 space-y-8">
        {/* Genel Bakış - Randevular */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No upcoming appointments.</p>
          ) : (
            <ul className="list-none p-0">
              {appointments.map((appointment: Appointment) => (
                <li key={appointment.id} className="mb-4 p-4 rounded-lg shadow-soft bg-background">
                  <p className="font-semibold text-foreground">
                    {appointment.customers?.name || 'Unknown Customer'} - {appointment.services?.name || 'Unknown Service'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Date: {new Date(appointment.appointment_time).toLocaleString()}
                  </p>
                  <p className={`text-sm font-medium ${appointment.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                    Status: {appointment.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Hizmet Yönetimi (Placeholder) */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Service Management</h2>
          {services.length === 0 ? (
            <p className="text-muted-foreground">No services added yet.</p>
          ) : (
            <ul className="list-none p-0">
              {services.map((service) => (
                <li key={service.id} className="mb-2 text-foreground">
                  {service.name} - ${service.price} ({service.duration_minutes} min)
                </li>
              ))}
            </ul>
          )}
          <button className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft">
            Add New Service
          </button>
        </section>

        {/* Çalışma Saatleri Ayarı (Placeholder) */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Working Hours Setup</h2>
          <p className="text-muted-foreground">
            Set your available working hours here.
          </p>
          <button className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft">
            Edit Hours
          </button>
        </section>

        {/* Galeri Yükleme (Placeholder) */}
        <section className="bg-card p-6 rounded-2xl shadow-soft">
          <h2 className="text-2xl font-bold mb-4">Gallery Upload</h2>
          <p className="text-muted-foreground">
            Upload images of your work.
          </p>
          <button className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft">
            Upload Images
          </button>
        </section>
      </main>
    </div>
  )
}
