import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GalleryManager from './_components/GalleryManager';

export default async function GalleryPage() {
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
    return <div>Berber bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const { data: images, error: imgError } = await supabase
    .from('barber_gallery')
    .select('*')
    .eq('barber_id', barber.id);

  if (imgError) {
    console.error('Error fetching gallery:', imgError);
    return <div>Galeri yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Galeri Yönetimi</h1>
      <GalleryManager images={images || []} barberId={barber.id} />
    </div>
  );
}
