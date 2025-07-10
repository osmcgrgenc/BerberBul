import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AppointmentBookingForm } from './_components/AppointmentBookingForm';

interface BarberProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function BarberProfilePage({ params }: BarberProfilePageProps) {
  const supabase = createClient();

  const { data: barber, error } = await supabase
    .from('barbers')
    .select(
      `
      id, name, slug, category, bio, address, tenant_id,
      services ( id, name, description, price, duration_minutes ),
      working_hours ( day_of_week, start_time, end_time )
      `
    )
    .eq('slug', params.slug)
    .single();

  if (error || !barber) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{barber.name}</h1>
      <p className="text-lg text-gray-600">{barber.category}</p>
      <div className="flex items-center gap-2 mt-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="text-xl font-semibold">{averageRating}</span>
        <span className="text-gray-600">({barber.reviews.length} yorum)</span>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Hakkında</h2>
        <p className="mt-2 text-gray-700">{barber.bio || 'Bu berber henüz bir tanıtım yazısı eklememiş.'}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Hizmetler</h2>
        {barber.services && barber.services.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {barber.services.map((service: any) => (
              <li key={service.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                <span className="font-semibold">₺{service.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600">Bu berberin henüz tanımlanmış bir hizmeti bulunmamaktadır.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Çalışma Saatleri</h2>
        {barber.working_hours && barber.working_hours.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {barber.working_hours.map((wh: any) => (
              <li key={wh.day_of_week} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="capitalize font-medium">{wh.day_of_week}</span>
                <span>{wh.start_time} - {wh.end_time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600">Bu berberin henüz tanımlanmış çalışma saatleri bulunmamaktadır.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Randevu Al</h2>
        <AppointmentBookingForm
          barberId={barber.id}
          tenantId={barber.tenant_id}
          barberSlug={barber.slug}
          services={barber.services}
          workingHours={barber.working_hours}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Yorumlar</h2>
        {barber.reviews && barber.reviews.length > 0 ? (
          <div className="space-y-4 mt-4">
            {barber.reviews.map((review: any) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.customers.name}</span>
                  <span className="text-sm text-gray-500">{format(new Date(review.created_at), 'dd.MM.yyyy')}</span>
                </div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-gray-600">Bu berber için henüz yorum bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}
