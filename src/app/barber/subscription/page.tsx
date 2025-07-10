import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PricingCard } from '@/components/organisms/PricingCard';
import { subscribeToPlan } from './actions';

export default async function SubscriptionPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: barber, error } = await supabase
    .from('barbers')
    .select('subscription_status, current_period_end')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return <div>Abonelik bilgileri yüklenirken bir hata oluştu.</div>;
  }

  const isSubscribed = barber?.subscription_status === 'active';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Abonelik Yönetimi</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <p className="text-lg">Mevcut Durum: <span className="font-semibold text-emerald-600">{barber.subscription_status}</span></p>
        {barber.current_period_end && 
          <p className="text-sm text-gray-500 mt-2">
            Aboneliğiniz {new Date(barber.current_period_end).toLocaleDateString()} tarihinde yenilenecektir.
          </p>
        }
      </div>

      <h2 className="text-xl font-bold mb-4">Planlarımız</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PricingCard
          planName="Aylık Plan"
          price="₺99"
          period="ay"
          features={[
            'Profilinizi yayınlayın',
            'Sınırsız randevu',
            'Temel destek',
          ]}
          onSubscribe={async () => {
            'use server';
            const formData = new FormData();
            formData.append('planId', 'monthly');
            await subscribeToPlan(formData);
          }}
          disabled={isSubscribed}
        />
        <PricingCard
          planName="Yıllık Plan"
          price="₺999"
          period="yıl"
          features={[
            'Profilinizi yayınlayın',
            'Sınırsız randevu',
            'Öncelikli destek',
            'Özel rozet',
          ]}
          onSubscribe={async () => {
            'use server';
            const formData = new FormData();
            formData.append('planId', 'annual');
            await subscribeToPlan(formData);
          }}
          disabled={isSubscribed}
        />
      </div>
    </div>
  );
}
