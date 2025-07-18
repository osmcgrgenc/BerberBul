'use client';

import { useState, useEffect, useActionState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { updateUnavailableDates } from '../actions';
import { useFormStatus } from 'react-dom';

interface UnavailableDatesFormProps {
  initialDates: string[];
  barberId: string;
}

const initialState = { message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Kaydediliyor...' : 'Özel Günleri Güncelle'}
    </Button>
  );
}

export function UnavailableDatesForm({ initialDates, barberId }: UnavailableDatesFormProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(initialDates.map(d => new Date(d)));
  const [state, formAction] = useActionState(updateUnavailableDates, initialState);

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
      <input type="hidden" name="barberId" value={barberId} />
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={(dates) => setSelectedDates(dates ?? [])}
        className="rounded-md border"
      />
      {selectedDates.map(date => (
        <input
          key={date.toISOString()}
          type="hidden"
          name="unavailable_dates"
          value={format(date, 'yyyy-MM-dd')}
          readOnly
        />
      ))}
      <SubmitButton />
    </form>
  );
}
