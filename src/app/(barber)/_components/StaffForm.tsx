
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type StaffFormValues = {
  id?: string; // Düzenleme için gerekli, ancak şimdilik sadece ekleme/silme
  name: string;
  specialty?: string; // Uzmanlık alanı opsiyonel
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
        <Label htmlFor="specialty">Uzmanlık Alanı (Opsiyonel)</Label>
        <Input id="specialty" {...register('specialty')} />
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
