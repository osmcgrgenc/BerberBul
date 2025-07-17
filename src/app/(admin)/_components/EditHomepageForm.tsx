
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Bu type, form verilerinin yapısını tanımlar.
// Gerçek uygulamada bu veriler veritabanından gelecek.
type HeroSectionData = {
  title: string;
  subtitle: string;
};

export default function EditHomepageForm() {
  // Örnek başlangıç verileri
  const initialData: HeroSectionData = {
    title: 'BerberBul ile Yeni Bir Sen',
    subtitle: 'Yakınındaki en iyi berberleri keşfet, kolayca randevu al. Modern, hızlı ve güvenilir berber randevu platformu.',
  };

  const { register, handleSubmit, formState: { errors } } = useForm<HeroSectionData>({
    defaultValues: initialData,
  });

  const onSubmit = (data: HeroSectionData) => {
    console.log('Kaydedilen Veriler:', data);
    // Burada verileri veritabanına kaydetmek için bir server action çağrılabilir.
    alert('Değişiklikler kaydedildi! (Konsolu kontrol edin)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Ana Başlık</Label>
        <Input 
          id="title" 
          {...register('title', { required: 'Başlık alanı zorunludur.' })} 
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Alt Başlık</Label>
        <Input 
          id="subtitle" 
          {...register('subtitle', { required: 'Alt başlık alanı zorunludur.' })} 
        />
        {errors.subtitle && <p className="text-red-500 text-sm">{errors.subtitle.message}</p>}
      </div>

      <Button type="submit">Değişiklikleri Kaydet</Button>
    </form>
  );
}
