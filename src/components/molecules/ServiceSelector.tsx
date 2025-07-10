'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
}

interface ServiceSelectorProps {
  services: Service[];
  onServiceSelect: (serviceId: string | null, duration: number | null) => void;
}

export function ServiceSelector({ services, onServiceSelect }: ServiceSelectorProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleSelect = (service: Service) => {
    if (selectedServiceId === service.id) {
      setSelectedServiceId(null);
      onServiceSelect(null, null);
    } else {
      setSelectedServiceId(service.id);
      onServiceSelect(service.id, service.duration_minutes);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <Card
          key={service.id}
          className={cn(
            'cursor-pointer hover:shadow-lg transition-shadow',
            selectedServiceId === service.id && 'border-2 border-blue-500 shadow-lg'
          )}
          onClick={() => handleSelect(service)}
        >
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{service.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-lg">₺{service.price}</span>
              <span className="text-sm text-gray-500">{service.duration_minutes} dk</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
