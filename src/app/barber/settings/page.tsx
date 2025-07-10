import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileSettingsForm } from '@/components/organisms/ProfileSettingsForm';

export default async function SettingsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: barber, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching barber profile:', error);
    // Burada kullanıcıya bir hata mesajı göstermek daha iyi olabilir.
    return <div>Berber profili yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profil Ayarları</h1>
      <ProfileSettingsForm barber={barber} />
    </div>
  );
}
