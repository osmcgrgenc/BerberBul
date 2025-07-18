import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Review } from '@/lib/types';
import ReviewResponseForm from './_components/ReviewResponseForm';
import { Star } from 'lucide-react';

export default async function BarberReviewsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (barberError || !barber) {
    console.error('Error fetching barber ID:', barberError);
    return <div>Yorumlar yüklenirken bir hata oluştu.</div>;
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at,
      customers ( name ),
      review_responses ( id, response_text, created_at )
    `)
    .eq('barber_id', barber.id)
    .order('created_at', { ascending: false });

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
    return <div>Yorumlar yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Yorumlar</h1>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: Review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{review.customers.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(review.created_at), 'dd.MM.yyyy')}</span>
              </div>
              <div className="flex items-center mt-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
              {review.review_responses && review.review_responses.length > 0 && (
                <div className="mt-2 p-2 border-l-2 border-gray-300 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yanıtınız:</p>
                  <p className="text-gray-800 dark:text-gray-200">{review.review_responses[0].response_text}</p>
                </div>
              )}
              <ReviewResponseForm reviewId={String(review.id)} initialResponse={review.review_responses?.[0]?.response_text} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Henüz yorum bulunmamaktadır.</p>
      )}
    </div>
  );
}
