import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AppointmentBookingForm } from './_components/AppointmentBookingForm';
import { Service, WorkingHour, Review, Barber } from '@/lib/types';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import FavoriteButton from './_components/FavoriteButton';
import { format } from 'date-fns';
import { PostgrestError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BarberProfilePage({ params, searchParams }: PageProps) {
  const supabase = await createClient();

  const { data: barber, error } = await supabase
    .from('barbers')
    .select(
      `
      id, name, slug, category, bio, address, tenant_id,
      services ( id, name, description, price, duration_minutes ),
      working_hours ( day_of_week, start_time, end_time ),
      reviews ( id, rating, comment, created_at, customers ( name ), review_responses ( response_text, created_at ) )
      `
    )
    .eq('slug', (await params).slug)
    .single() as { data: Barber | null, error: PostgrestError | null };

  if (error || !barber) {
    notFound();
  }

  // URL parametrelerinden mesajları al
  const { success, error: urlError } = await searchParams;

  const getMessage = () => {
    if (success === 'appointment-created') {
      return {
        type: 'success' as const,
        message: 'Randevunuz başarıyla oluşturuldu!'
      };
    }
    if (success === 'favorite-added') {
      return {
        type: 'success' as const,
        message: 'Berber favorilerinize eklendi!'
      };
    }
    if (success === 'favorite-removed') {
      return {
        type: 'success' as const,
        message: 'Favorilerden kaldırıldı!'
      };
    }
    if (urlError === 'appointment-failed') {
      return {
        type: 'error' as const,
        message: 'Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      };
    }
    if (urlError === 'appointment-conflict') {
      return {
        type: 'error' as const,
        message: 'Seçilen saat için zaten bir randevu var. Lütfen başka bir zaman seçin.'
      };
    }
    if (urlError === 'favorite-failed') {
      return {
        type: 'error' as const,
        message: 'Favori işlemi sırasında bir hata oluştu.'
      };
    }
    return null;
  };

  const message = getMessage();

  const { data: { user } } = await supabase.auth.getUser();
  let isFavorite = false;
  if (user) {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (customer) {
      const { data: fav } = await supabase
        .from('customer_favorites')
        .select('id')
        .eq('customer_id', customer.id)
        .eq('barber_id', barber.id)
        .single();
      isFavorite = !!fav;
    }
  }

  const reviews = barber.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{barber.name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">{barber.category}</p>
      <div className="flex items-center gap-2 mt-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{averageRating}</span>
        <span className="text-gray-600 dark:text-gray-400">({reviews.length} yorum)</span>
      </div>
      {user && (
        <div className="mt-4">
          <FavoriteButton barberId={barber.id.toString()} barberSlug={barber.slug} isFavorite={isFavorite} />
        </div>
      )}

      {message && (
        <Alert className={`mt-4 ${message.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'}`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
            {message.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Hakkında</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{barber.bio || 'Bu berber henüz bir tanıtım yazısı eklememiş.'}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Hizmetler</h2>
        {barber.services && barber.services.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {barber.services.map((service: Service) => (
              <li key={service.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{service.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">₺{service.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600 dark:text-gray-400">Bu berberin henüz tanımlanmış bir hizmeti bulunmamaktadır.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Çalışma Saatleri</h2>
        {barber.working_hours && barber.working_hours.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {barber.working_hours.map((wh: WorkingHour) => (
              <li key={wh.day_of_week} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <span className="capitalize font-medium text-gray-900 dark:text-gray-100">{wh.day_of_week}</span>
                <span className="text-gray-700 dark:text-gray-300">{wh.start_time} - {wh.end_time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600 dark:text-gray-400">Bu berberin henüz tanımlanmış çalışma saatleri bulunmamaktadır.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Randevu Al</h2>
        <AppointmentBookingForm
          barberId={barber.id}
          tenantId={barber.tenant_id}
          barberSlug={barber.slug}
          services={barber.services}
          workingHours={barber.working_hours}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Yorumlar</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4 mt-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{review.customers?.[0]?.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(review.created_at), 'dd.MM.yyyy')}</span>
                </div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                {review.review_responses && review.review_responses.length > 0 && (
                  <div className="mt-2 p-2 border-l-2 border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Berber Yanıtı:</p>
                    <p className="text-gray-800 dark:text-gray-200">{review.review_responses[0].response_text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-gray-600 dark:text-gray-400">Bu berber için henüz yorum bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}
