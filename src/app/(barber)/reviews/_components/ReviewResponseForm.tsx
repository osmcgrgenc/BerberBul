'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { respondReview } from '../actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const initialState = { message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" aria-disabled={pending}>
      {pending ? 'Gönderiliyor...' : 'Yanıtı Kaydet'}
    </Button>
  );
}

export default function ReviewResponseForm({ reviewId, initialResponse }: { reviewId: string; initialResponse?: string }) {
  const [state, formAction] = useActionState(respondReview, initialState);

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
    <form action={formAction} className="space-y-2 mt-2">
      <input type="hidden" name="reviewId" value={reviewId} />
      <textarea
        name="response"
        defaultValue={initialResponse}
        rows={2}
        className="w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600"
      />
      <SubmitButton />
    </form>
  );
}
