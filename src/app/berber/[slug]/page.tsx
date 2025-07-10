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
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Hakkında</h2>
        <p className="mt-2 text-gray-700">{barber.bio || 'Bu berber henüz bir tanıtım yazısı eklememiş.'}</p>
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
    </div>
  );
}
