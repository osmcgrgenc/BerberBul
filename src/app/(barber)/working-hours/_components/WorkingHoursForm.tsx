
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { updateWorkingHours } from '../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface WorkingHour {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_closed: boolean;
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
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(initialWorkingHours.map(wh => ({ ...wh, is_closed: wh.is_closed || false })));
  const [state, formAction] = useActionState(updateWorkingHours, initialState);

  const daysOfWeek = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
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

  const handleTimeChange = (dayKey: string, type: 'start' | 'end', value: string) => {
    setWorkingHours(prevHours => {
      const existing = prevHours.find(wh => wh.day_of_week === dayKey);
      if (existing) {
        return prevHours.map(wh =>
          wh.day_of_week === dayKey ? { ...wh, [type === 'start' ? 'start_time' : 'end_time']: value } : wh
        );
      } else {
        return [...prevHours, { day_of_week: dayKey, start_time: type === 'start' ? value : '', end_time: type === 'end' ? value : '', is_closed: false }];
      }
    });
  };

  const handleClosedChange = (dayKey: string, checked: boolean) => {
    setWorkingHours(prevHours => {
      const existing = prevHours.find(wh => wh.day_of_week === dayKey);
      if (existing) {
        return prevHours.map(wh =>
          wh.day_of_week === dayKey ? { ...wh, is_closed: checked, start_time: checked ? '' : wh.start_time, end_time: checked ? '' : wh.end_time } : wh
        );
      } else {
        return [...prevHours, { day_of_week: dayKey, start_time: '', end_time: '', is_closed: checked }];
      }
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="barberId" value={barberId} />
      {daysOfWeek.map(day => {
        const currentHours = workingHours.find(wh => wh.day_of_week === day.key);
        const isClosed = currentHours?.is_closed || false;
        const startTime = currentHours?.start_time ?? '09:00';
        const endTime = currentHours?.end_time ?? '18:00';

        return (
          <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Label className="w-24 capitalize text-gray-700 dark:text-gray-300">{day.label}</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${day.key}-closed`}
                checked={isClosed}
                onCheckedChange={(checked) => handleClosedChange(day.key, checked as boolean)}
                name={`${day.key}_is_closed`}
              />
              <Label htmlFor={`${day.key}-closed`} className="text-gray-700 dark:text-gray-300">Kapalı</Label>
            </div>
            
            <Input
              type="time"
              name={`${day.key}_start_time`}
              defaultValue={startTime}
              onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
              className="w-32" 
              disabled={isClosed}
            />
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <Input
              type="time"
              name={`${day.key}_end_time`}
              defaultValue={endTime}
              onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
              className="w-32"
              disabled={isClosed}
            />
          </div>
        );
      })}
      <SubmitButton />
    </form>
  );
}

