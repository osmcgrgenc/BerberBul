
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type StaffFormValues = {
  id?: string; // Düzenleme için gerekli, ancak şimdilik sadece ekleme/silme
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'employee';
};

interface StaffFormProps {
  initialData?: StaffFormValues;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function StaffForm({ initialData, onSubmit, onCancel, isSubmitting }: StaffFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormValues>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Personel Adı</Label>
        <Input id="name" {...register('name', { required: 'Personel adı zorunludur.' })} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" {...register('email', { required: 'E-posta zorunludur.' })} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
        <Input id="phone" {...register('phone')} />
      </div>
      <div>
        <Label htmlFor="role">Rol</Label>
        <select id="role" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" {...register('role', { required: true })}>
          <option value="employee">Personel</option>
          <option value="owner">İşletme Sahibi</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          İptal
        </Button>
      </div>
    </form>
  );
}
