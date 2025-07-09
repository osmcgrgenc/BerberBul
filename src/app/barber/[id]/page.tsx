/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DatePickerDemo } from '@/components/ui/date-picker'
import { Clock, MapPin, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner' // toast'ı import et

interface Barber {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  tenant_id: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function BarberProfilePage({ params }: { params: any }) {
  const supabase = createClient();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingBarber, setLoadingBarber] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const awaitedParams = await params;

      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('*')
        .eq('id', awaitedParams.id)
        .single();

      if (barberError || !barberData) {
        notFound();
      } else {
        setBarber(barberData);

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('barber_id', barberData.id);

        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          toast.error('Error fetching services.');
        } else {
          setServices(servicesData || []);
        }
      }
      setLoadingBarber(false);
      setLoadingServices(false);
    }
    fetchData();
  }, [params, supabase]);

  if (loadingBarber || loadingServices) {
    return <div className="text-center mt-8">Loading profile...</div>;
  }

  if (!barber) {
    return null;
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      toast.error('Please select a date, time, and service for your appointment.');
      return;
    }

    setLoadingBooking(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to book an appointment.');
      setLoadingBooking(false);
      return;
    }

    let customerId: string | null = null;
    const { data: customerData } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (customerData) {
      customerId = customerData.id;
    } else {
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert({ user_id: user.id, name: user.email, email: user.email }) // Varsayılan isim ve e-posta
        .select('id')
        .single();

      if (newCustomerError) {
        console.error('Error creating customer:', newCustomerError);
        toast.error('Failed to create customer profile.');
        setLoadingBooking(false);
        return;
      }
      customerId = newCustomer.id;
    }

    if (!customerId) {
      toast.error('Could not determine customer ID.');
      setLoadingBooking(false);
      return;
    }

    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const { error: bookingError } = await supabase.from('appointments').insert({
      tenant_id: barber.tenant_id,
      barber_id: barber.id,
      customer_id: customerId,
      service_id: selectedService,
      appointment_time: appointmentDateTime.toISOString(),
      status: 'pending',
    });

    if (bookingError) {
      toast.error(`Error booking appointment: ${bookingError.message}`);
    } else {
      toast.success('Appointment booked successfully!');
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedService('');
    }
    setLoadingBooking(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section / Avatar */}
      <section className="flex flex-col items-center mb-8">
        {/* <img src={barber.image_url || '/placeholder-avatar.jpg'} alt={barber.name} className="w-32 h-32 rounded-full object-cover shadow-soft mb-4" /> */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-5xl font-bold mb-4 shadow-soft">
          {barber.name.charAt(0)}
        </div>
        <h1 className="text-4xl font-bold text-foreground">{barber.name}</h1>
        {barber.description && <p className="text-muted-foreground mt-2 max-w-xl text-center">{barber.description}</p>}
        {/* {barber.rating && (
          <div className="flex items-center mt-2">
            {[...Array(Math.floor(barber.rating))].map((_, i) => (
              <Star key={i} size={20} fill="gold" stroke="gold" />
            ))}
            <span className="ml-2 text-gray-600">{barber.rating.toFixed(1)}</span>
          </div>
        )} */}
      </section>

      {/* İletişim Bilgileri */}
      <section className="bg-card p-6 rounded-2xl shadow-soft mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
          {barber.address && (
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              <span>{barber.address}</span>
            </div>
          )}
          {barber.phone && (
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              <span>{barber.phone}</span>
            </div>
          )}
          {barber.email && (
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              <span>{barber.email}</span>
            </div>
          )}
          {/* Çalışma Saatleri Placeholder */}
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <span>Working Hours: 9:00 AM - 6:00 PM (Mon-Sat)</span>
          </div>
        </div>
      </section>

      {/* Hizmetler Bölümü */}
      <section className="bg-card p-6 rounded-2xl shadow-soft mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Our Services</h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground">No services available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="border p-4 rounded-lg shadow-soft bg-background">
                <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                <p className="text-muted-foreground text-sm">${service.price} - {service.duration_minutes} min</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Randevu Alma Bölümü */}
      <section className="bg-card p-6 rounded-2xl shadow-soft mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Book an Appointment</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground">Select Date</label>
            <DatePickerDemo selected={selectedDate} onSelect={setSelectedDate} />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-foreground">Select Time</label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-input text-foreground"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-foreground">Select Service</label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-input text-foreground"
            >
              <option value="">-- Select a service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} ({service.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBooking}
            disabled={loadingBooking}
            className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-2xl shadow-soft"
          >
            {loadingBooking ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </section>

      {/* İnceleme Bölümü (Placeholder) */}
      <section className="bg-card p-6 rounded-2xl shadow-soft mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Customer Reviews</h2>
        <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
        {/* Yorum formu ve yorum listesi buraya gelecek */}
      </section>

      {/* Galeri Bölümü (Placeholder) */}
      <section className="bg-card p-6 rounded-2xl shadow-soft mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Gallery</h2>
        <p className="text-muted-foreground">No images in the gallery yet.</p>
        {/* Resim galerisi buraya gelecek */}
      </section>
    </div>
  );
}