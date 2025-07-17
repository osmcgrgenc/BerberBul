
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerProfileFormValues } from '../actions';

interface CustomerProfileFormProps {
  initialData: CustomerProfileFormValues;
  onSubmit: (formData: CustomerProfileFormValues) => void;
  isSubmitting?: boolean;
}

export default function CustomerProfileForm({ initialData, onSubmit, isSubmitting }: CustomerProfileFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerProfileFormValues>({
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CustomerProfileFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" {...register('name', { required: 'Ad soyad zorunludur.' })} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" {...register('email', { required: 'E-posta zorunludur.', pattern: /.+@.+\..+/i })} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" type="tel" {...register('phone')} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Kaydediliyor...' : 'Profili Güncelle'}
      </Button>
    </form>
  );
}
