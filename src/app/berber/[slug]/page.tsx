import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface BarberProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function BarberProfilePage({ params }: BarberProfilePageProps) {
  const supabase = createClient();

  const { data: barber, error } = await supabase
    .from('barbers')
    .select('*')
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
    </div>
  );
}
