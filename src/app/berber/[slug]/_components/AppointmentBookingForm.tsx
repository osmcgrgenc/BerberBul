'use client';

import { useState } from 'react';
import { ServiceSelector } from '@/components/molecules/ServiceSelector';
import { AppointmentScheduler } from '@/components/organisms/AppointmentScheduler';
import { createAppointment } from '../actions';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
}

interface WorkingHour {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface AppointmentBookingFormProps {
  barberId: string;
  tenantId: string;
  barberSlug: string;
  services: Service[];
  workingHours: WorkingHour[];
}

export function AppointmentBookingForm({
  barberId,
  tenantId,
  barberSlug,
  services,
  workingHours,
}: AppointmentBookingFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState<number | null>(null);

  const handleServiceSelect = (serviceId: string | null, duration: number | null) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceDuration(duration);
  };

  const handleCreateAppointment = async (appointmentTime: Date) => {
    if (!selectedServiceId) {
      toast.error('Lütfen bir hizmet seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('barberId', barberId);
    formData.append('tenantId', tenantId);
    formData.append('serviceId', selectedServiceId);
    formData.append('appointmentTime', appointmentTime.toISOString());
    formData.append('barberSlug', barberSlug);

    const result = await createAppointment(formData);

    if (result?.message) {
      if (result.message.includes('hata')) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Hizmet Seçimi</h2>
        {services && services.length > 0 ? (
          <ServiceSelector services={services} onServiceSelect={handleServiceSelect} />
        ) : (
          <p className="text-gray-600">Bu berberin henüz tanımlanmış bir hizmeti bulunmamaktadır.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Randevu Takvimi</h2>
        <AppointmentScheduler
          barberId={barberId}
          workingHours={workingHours}
          selectedServiceDuration={selectedServiceDuration}
          onCreateAppointment={handleCreateAppointment}
        />
      </div>
    </div>
  );
}
