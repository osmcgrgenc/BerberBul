'use client';

import { useActionState, useEffect } from 'react';
import { addCustomerNote } from '../actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const initialState = { message: '' };

export default function NoteForm({ barberId, customerId }: { barberId: string; customerId: string }) {
  const [state, formAction] = useActionState(addCustomerNote, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('hata')) {
        console.error(state.message);
      } else {
        console.log(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="barberId" value={barberId} />
      <input type="hidden" name="customerId" value={customerId} />
      <select name="note_type" className="border rounded p-1 dark:bg-gray-700 dark:border-gray-600">
        <option value="technical">Teknik</option>
        <option value="personal">Kişisel</option>
        <option value="allergy">Hassasiyet</option>
      </select>
      <Textarea name="content" rows={3} className="dark:bg-gray-700 dark:border-gray-600" />
      <Button type="submit">Not Ekle</Button>
    </form>
  );
}
