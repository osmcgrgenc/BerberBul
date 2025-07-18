'use client';

import { useTransition } from 'react';
import { addFavorite, removeFavorite } from '@/app/(customer)/favorites/actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  barberId: string;
  barberSlug: string;
  isFavorite: boolean;
}

export default function FavoriteButton({ barberId, barberSlug, isFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    const formData = new FormData();
    formData.append('barberId', barberId);
    formData.append('barberSlug', barberSlug);
    if (isFavorite) {
      formData.append('redirectTo', `/barber/${barberSlug}`);
      startTransition(async () => {
        try {
          await removeFavorite(formData);
        } catch {
          toast.error('Favori kaldırılırken hata oluştu');
        }
      });
    } else {
      startTransition(async () => {
        try {
          await addFavorite(formData);
        } catch {
          toast.error('Favoriye eklenirken hata oluştu');
        }
      });
    }
  };

  return (
    <Button type="button" onClick={handleAction} variant={isFavorite ? 'secondary' : 'default'} disabled={isPending} size="sm">
      {isFavorite ? 'Favoriden Çıkar' : 'Favorilere Ekle'}
    </Button>
  );
}
