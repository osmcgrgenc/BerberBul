'use client';

import { useState } from 'react';
import { ServiceSelector } from '@/components/molecules/ServiceSelector';
import { AppointmentScheduler } from '@/components/organisms/AppointmentScheduler';
import { createAppointment } from '../actions';
import { Service, WorkingHour } from '@/lib/types';

interface AppointmentBookingFormProps {
  barberId: number;
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
  const [selectedServiceId, setSelectedServiceId] = useState<string | number>('');
  const [selectedServiceDuration, setSelectedServiceDuration] = useState<number | null>(null);

  const handleServiceSelect = (serviceId: string | number, duration: number | null) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceDuration(duration);
  };

  const handleCreateAppointment = async (appointmentTime: Date) => {
    if (!selectedServiceId) {
      return;
    }

    const formData = new FormData();
    formData.append('barberId', barberId.toString());
    formData.append('tenantId', tenantId);
    formData.append('serviceId', selectedServiceId.toString());
    formData.append('appointmentTime', appointmentTime.toISOString());
    formData.append('barberSlug', barberSlug);

    await createAppointment(formData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Hizmet Seçimi</h2>
        {services && services.length > 0 ? (
          <ServiceSelector services={services} onServiceSelect={handleServiceSelect} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Bu berberin henüz tanımlanmış bir hizmeti bulunmamaktadır.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Randevu Takvimi</h2>
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
