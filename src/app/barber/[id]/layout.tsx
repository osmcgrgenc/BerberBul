/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: barber, error } = await supabase
    .from('barbers')
    .select('name, description')
    .eq('id', params.id)
    .single();

  if (error || !barber) {
    return {
      title: 'Barber Not Found',
      description: 'The barber profile you are looking for does not exist.',
    };
  }

  return {
    title: `${barber.name} - Berberbul`,
    description: barber.description || `Book an appointment with ${barber.name} at Berberbul.`,
    openGraph: {
      title: `${barber.name} - Berberbul`,
      description: barber.description || `Book an appointment with ${barber.name} at Berberbul.`,
      // images: ['/some-default-image.jpg'], // Dinamik og:image buraya gelecek
    },
  };
}

export default function BarberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
