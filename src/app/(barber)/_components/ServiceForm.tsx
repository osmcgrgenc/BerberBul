'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ServiceFormValues = {
  id?: string;
  name: string;
  price: number;
  duration_minutes: number;
};

interface ServiceFormProps {
  initialData?: ServiceFormValues;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ServiceForm({ initialData, onSubmit, onCancel, isSubmitting }: ServiceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormValues>({
    defaultValues: initialData,
  });

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Hizmet Adı</Label>
          <Input id="name" {...register('name', { required: 'Hizmet adı zorunludur.' })} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Fiyat (TL)</Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01"
            {...register('price', { 
              required: 'Fiyat zorunludur.',
              valueAsNumber: true,
              min: { value: 0, message: 'Fiyat 0dan küçük olamaz.' }
            })} 
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="duration_minutes">Süre (Dakika)</Label>
          <Input 
            id="duration_minutes" 
            type="number" 
            {...register('duration_minutes', { 
              required: 'Süre zorunludur.',
              valueAsNumber: true,
              min: { value: 1, message: 'Süre 1 dakikadan az olamaz.' }
            })} 
          />
          {errors.duration_minutes && <p className="text-red-500 text-sm">{errors.duration_minutes.message}</p>}
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
    </div>
  );
}