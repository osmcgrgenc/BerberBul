'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createReview } from '@/app/(customer)/my-appointments/actions';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Gönderiliyor...' : 'Yorumu Gönder'}
    </Button>
  );
}

interface ReviewFormProps {
  barberId: number | string;
  appointmentId: number | string;
}

export function ReviewForm({ barberId, appointmentId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [state, formAction] = useActionState(createReview, initialState);

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
    <form action={formAction} className="space-y-4 mt-4">
      <input type="hidden" name="barberId" value={barberId} />
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Puanınız</label>
        <div className="flex space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => setRating(star)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yorumunuz</label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          placeholder="Deneyiminizi paylaşın..."
        />
      </div>

      <SubmitButton />
    </form>
  );
}
