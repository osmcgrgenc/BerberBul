
'use client';

import { Barber, Service } from '@/lib/types';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateBarberProfile, addService, updateService, deleteService, addStaff, deleteStaff } from '@/app/(barber)/actions';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ServiceForm, { ServiceFormValues } from '@/app/(barber)/_components/ServiceForm';
import StaffForm, { StaffFormValues } from '@/app/(barber)/_components/StaffForm';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Kaydediliyor...' : 'Profili Güncelle'}
    </Button>
  );
}

function ServicesTab({ initialServices, barberId }: { initialServices: Service[], barberId: number }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceFormValues | undefined>(undefined);

  const handleAddService = async (data: ServiceFormValues) => {
    const result = await addService(barberId, data);
    if (result.message.includes('başarıyla')) {
      toast.success(result.message);
      setIsFormOpen(false);
      setEditingService(undefined);
      setServices(prev => [...prev, { ...data, id: Date.now().toString(), description: '' }]); // Geçici ID
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
      setServices(prev => prev.map(s => (s.id === data.id ? { ...s, ...data, description: '' } : s)));
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
    <div className="p-6 border-t-0 rounded-b-lg bg-white dark:bg-gray-800 shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Hizmet Yönetimi</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Dükkanınızda sunduğunuz hizmetleri buradan yönetebilirsiniz.</p>

      <div className="space-y-4 mb-6">
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
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingService({ id: service.id as string, name: service.name, price: service.price, duration_minutes: service.duration_minutes });
                  setIsFormOpen(true);
                }}>
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

function StaffTab({ barberId }: { barberId: number }) {
  const supabase = createClient();
  const [staff, setStaff] = useState<{ id: string; name: string; email: string; role: string; is_active: boolean }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, email, role, is_active')
        .eq('barber_id', barberId);
      if (!error && data) {
        setStaff(data);
      }
    }
    fetchStaff();
  }, [barberId, supabase]);

  const handleAddStaff = async (data: StaffFormValues) => {
    const result = await addStaff(barberId, data);
    if (result.message.includes('başarıyla') && result.staff) {
      toast.success(result.message);
      setIsFormOpen(false);
      setStaff(prev => [...prev, result.staff]);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    const result = await deleteStaff(barberId, staffId);
    if (result.message.includes('başarıyla')) {
      toast.success(result.message);
      setStaff(prev => prev.filter(s => s.id !== staffId));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="p-6 border-t-0 rounded-b-lg bg-white dark:bg-gray-800 shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Personel Yönetimi</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Çalışanlarınızı buradan ekleyebilir veya kaldırabilirsiniz.</p>

      <div className="space-y-4 mb-6">
        {staff.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Henüz tanımlanmış personeliniz bulunmamaktadır.</p>
        ) : (
          staff.map(person => (
            <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{person.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{person.email} - {person.role}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteStaff(person.id)}>
                Kaldır
              </Button>
            </div>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsFormOpen(true)}>Yeni Personel Ekle</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Personel Ekle</DialogTitle>
          </DialogHeader>
          <StaffForm 
            onSubmit={handleAddStaff}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ProfileSettingsForm({ barber }: { barber: Barber }) {
  const [state, formAction] = useActionState(updateBarberProfile, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('hata')) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
        <TabsTrigger value="services">Hizmetler</TabsTrigger>
        <TabsTrigger value="staff">Personel</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <div className="p-6 border-t-0 rounded-b-lg bg-white dark:bg-gray-800 shadow space-y-4">
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Dükkan Adı</Label>
              <Input id="name" name="name" defaultValue={barber?.name || ''} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <Label htmlFor="address" className="text-gray-900 dark:text-gray-100">Adres</Label>
              <Input id="address" name="address" defaultValue={barber?.address || ''} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-900 dark:text-gray-100">Kategori</Label>
              <select
                id="category"
                name="category"
                defaultValue={barber?.category || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="erkek_kuaforu">Erkek Kuaförü</option>
                <option value="kadin_kuaforu">Kadın Kuaförü</option>
                <option value="pet_kuaforu">Pet Kuaförü</option>
                <option value="oto_kuaforu">Oto Kuaförü</option>
              </select>
            </div>
            <div>
              <Label htmlFor="bio" className="text-gray-900 dark:text-gray-100">Hakkında</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={barber?.bio || ''}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <SubmitButton />
          </form>
        </div>
      </TabsContent>
      <TabsContent value="services">
        <ServicesTab initialServices={barber?.services || []} barberId={barber.id} />
      </TabsContent>
      <TabsContent value="staff">
        <StaffTab barberId={barber.id} />
      </TabsContent>
    </Tabs>
  );
}

