import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PricingCard } from '@/components/organisms/PricingCard';
import { subscribeToPlan } from './actions';

export default async function SubscriptionPage() {
  const supabase = await createClient();

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
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Hata Oluştu
          </h2>
          <p className="text-red-700 dark:text-red-300">
            Abonelik bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </p>
        </div>
      </div>
    );
  }

  const isSubscribed = barber?.subscription_status === 'active';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Abonelik Yönetimi</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Mevcut Durum: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{barber.subscription_status}</span>
        </p>
        {barber.current_period_end && 
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Aboneliğiniz {new Date(barber.current_period_end).toLocaleDateString('tr-TR')} tarihinde yenilenecektir.
          </p>
        }
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Planlarımız</h2>
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
