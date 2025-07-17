
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // ShadCN'den Textarea import edelim

// Form verilerinin ve post'un tipini tanımlayalım
export type BlogPostFormValues = {
  title: string;
  slug: string;
  content: string;
  author: string;
};

interface BlogPostFormProps {
  initialData?: BlogPostFormValues;
  onSubmit: (data: BlogPostFormValues) => void;
  isSubmitting?: boolean;
}

export default function BlogPostForm({ initialData, onSubmit, isSubmitting }: BlogPostFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BlogPostFormValues>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <Label htmlFor="title">Yazı Başlığı</Label>
        <Input id="title" {...register('title', { required: 'Başlık zorunludur.' })} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL (slug)</Label>
        <Input id="slug" {...register('slug', { required: 'URL zorunludur.' })} />
        <p className="text-sm text-gray-500">Örn: yeni-baslayanlar-icin-react</p>
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik (Markdown destekli)</Label>
        <Textarea id="content" {...register('content', { required: 'İçerik zorunludur.' })} rows={10} />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Yazar</Label>
        <Input id="author" {...register('author', { required: 'Yazar adı zorunludur.' })} />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Kaydediliyor...' : 'Yazıyı Kaydet'}
      </Button>
    </form>
  );
}
