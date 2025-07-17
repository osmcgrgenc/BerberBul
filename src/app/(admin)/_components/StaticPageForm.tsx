
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type StaticPageFormValues = {
  title: string;
  slug: string;
  content: string;
};

interface StaticPageFormProps {
  initialData?: StaticPageFormValues;
  onSubmit: (data: StaticPageFormValues) => void;
  isSubmitting?: boolean;
}

export default function StaticPageForm({ initialData, onSubmit, isSubmitting }: StaticPageFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StaticPageFormValues>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <Label htmlFor="title">Sayfa Başlığı</Label>
        <Input id="title" {...register('title', { required: 'Başlık zorunludur.' })} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL (slug)</Label>
        <Input id="slug" {...register('slug', { required: 'URL zorunludur.' })} />
        <p className="text-sm text-gray-500">Örn: hakkimizda, iletisim, kvkk</p>
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik (Markdown destekli)</Label>
        <Textarea id="content" {...register('content', { required: 'İçerik zorunludur.' })} rows={15} />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Kaydediliyor...' : 'Sayfayı Kaydet'}
      </Button>
    </form>
  );
}
