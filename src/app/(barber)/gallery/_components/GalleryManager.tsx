'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadGalleryImages, deleteGalleryImage } from '../../actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';

interface GalleryImage {
  id: string;
  image_path: string;
}

const initialState = { message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Yükleniyor...' : 'Fotoğrafları Yükle'}
    </Button>
  );
}

export default function GalleryManager({ images, barberId }: { images: GalleryImage[]; barberId: string }) {
  const [gallery, setGallery] = useState<GalleryImage[]>(images);
  const [state, formAction] = useActionState(uploadGalleryImages, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('hata')) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  const handleDelete = async (image: GalleryImage) => {
    const result = await deleteGalleryImage(barberId, image.id, image.image_path);
    if (result.message.includes('başarı')) {
      setGallery(prev => prev.filter(img => img.id !== image.id));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="barberId" value={barberId} />
        <Input type="file" name="images" multiple className="dark:bg-gray-700 dark:border-gray-600" />
        <SubmitButton />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gallery.map(img => (
          <div key={img.id} className="relative group border rounded-md overflow-hidden">
            <NextImage
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${img.image_path}`}
              alt="Berber fotoğraf"
              width={300}
              height={120}
              className="object-cover w-full h-32"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 opacity-80 group-hover:opacity-100"
              onClick={() => handleDelete(img)}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
