'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { updateWorkingHours } from '../actions';

interface WorkingHour {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Kaydediliyor...' : 'Çalışma Saatlerini Güncelle'}
    </Button>
  );
}

export function WorkingHoursForm({ initialWorkingHours, barberId }: { initialWorkingHours: WorkingHour[]; barberId: string }) {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(initialWorkingHours);
  const [state, formAction] = useFormState(updateWorkingHours, initialState);

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('hata')) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setWorkingHours(prevHours => {
      const existing = prevHours.find(wh => wh.day_of_week === day);
      if (existing) {
        return prevHours.map(wh =>
          wh.day_of_week === day ? { ...wh, [type === 'start' ? 'start_time' : 'end_time']: value } : wh
        );
      } else {
        return [...prevHours, { day_of_week: day, start_time: type === 'start' ? value : '', end_time: type === 'end' ? value : '' }];
      }
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="barberId" value={barberId} />
      {daysOfWeek.map(day => {
        const currentHours = workingHours.find(wh => wh.day_of_week === day);
        return (
          <div key={day} className="flex items-center gap-4">
            <label className="w-24 capitalize">{day}</label>
            <input
              type="time"
              name={`${day}_start_time`}
              defaultValue={currentHours?.start_time || '09:00'}
              onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
              className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            />
            <span>-</span>
            <input
              type="time"
              name={`${day}_end_time`}
              defaultValue={currentHours?.end_time || '18:00'}
              onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
              className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        );
      })}
      <SubmitButton />
    </form>
  );
}
