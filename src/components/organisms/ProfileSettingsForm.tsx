'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateBarberProfile } from '@/app/barber/actions';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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

export function ProfileSettingsForm({ barber }: { barber: any }) {
  const [state, formAction] = useFormState(updateBarberProfile, initialState);

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
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
        <select
          id="category"
          name="category"
          defaultValue={barber?.category || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="erkek_kuaforu">Erkek Kuaförü</option>
          <option value="kadin_kuaforu">Kadın Kuaförü</option>
          <option value="pet_kuaforu">Pet Kuaförü</option>
          <option value="oto_kuaforu">Oto Kuaförü</option>
        </select>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hakkında</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={barber?.bio || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
