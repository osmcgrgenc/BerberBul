/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DatePickerDemo } from '@/components/ui/date-picker'

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
  const [services, setServices] = useState<Service[]>([]); // Hizmetler state'i eklendi
  const [loadingBarber, setLoadingBarber] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true); // Hizmetler için loading state'i

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(''); // Seçilen hizmet state'i
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const awaitedParams = await params;

      // Berber bilgilerini getir
      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('*')
        .eq('id', awaitedParams.id)
        .single();

      if (barberError || !barberData) {
        notFound();
      } else {
        setBarber(barberData);

        // Berberin hizmetlerini getir
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('barber_id', barberData.id);

        if (servicesError) {
          console.error('Error fetching services:', servicesError);
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
      alert('Please select a date, time, and service for your appointment.');
      return;
    }

    setLoadingBooking(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to book an appointment.');
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
        alert('Failed to create customer profile.');
        setLoadingBooking(false);
        return;
      }
      customerId = newCustomer.id;
    }

    if (!customerId) {
      alert('Could not determine customer ID.');
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
      service_id: selectedService, // Seçilen hizmet ID'si eklendi
      appointment_time: appointmentDateTime.toISOString(),
      status: 'pending',
    });

    if (bookingError) {
      alert(`Error booking appointment: ${bookingError.message}`);
    } else {
      alert('Appointment booked successfully!');
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedService('');
    }
    setLoadingBooking(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">{barber.name}</h1>
      <div className="border p-4 rounded-lg shadow-sm">
        <p className="text-gray-700 text-lg mb-2">{barber.description}</p>
        <p className="text-gray-600 text-sm mb-1">Address: {barber.address}</p>
        <p className="text-gray-600 text-sm mb-1">Phone: {barber.phone}</p>
        <p className="text-gray-600 text-sm">Email: {barber.email}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date</label>
              <DatePickerDemo selected={selectedDate} onSelect={setSelectedDate} />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Select Time</label>
              <input
                type="time"
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">Select Service</label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loadingBooking ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}