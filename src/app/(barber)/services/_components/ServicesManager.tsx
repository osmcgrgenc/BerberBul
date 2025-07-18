'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ServiceForm, { ServiceFormValues } from '@/app/(barber)/_components/ServiceForm';
import { Service } from '@/lib/types';
import { addService, updateService, deleteService } from '@/app/(barber)/actions';

interface ServicesManagerProps {
  initialServices: Service[];
  barberId: number;
}

export default function ServicesManager({ initialServices, barberId }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceFormValues | undefined>(undefined);

  const handleAddService = async (data: ServiceFormValues) => {
    const result = await addService(barberId, data);
    if (result.message.includes('başarıyla')) {
      toast.success(result.message);
      setIsFormOpen(false);
      setEditingService(undefined);
      setServices(prev => [...prev, { ...data, id: result.service.id, description: '' }]);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateService = async (data: ServiceFormValues) => {
    if (!data.id) return;
    const result = await updateService(barberId, data.id as string, data);
    if (result.message.includes('başarıyla')) {
      toast.success(result.message);
      setIsFormOpen(false);
      setEditingService(undefined);
      setServices(prev => prev.map(s => (s.id === data.id ? { ...s, ...data } : s)));
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    const result = await deleteService(barberId, serviceId);
    if (result.message.includes('başarıyla')) {
      toast.success(result.message);
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hizmetler</h1>
      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Henüz tanımlanmış bir hizmetiniz bulunmamaktadır.</p>
        ) : (
          services.map(service => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{service.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{service.price} TL - {service.duration_minutes} dk</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingService({ id: service.id as string, name: service.name, price: service.price, duration_minutes: service.duration_minutes }); setIsFormOpen(true); }}>
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id as string)}>
                  Sil
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { setEditingService(undefined); setIsFormOpen(true); }}>Yeni Hizmet Ekle</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            initialData={editingService}
            onSubmit={editingService ? handleUpdateService : handleAddService}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

