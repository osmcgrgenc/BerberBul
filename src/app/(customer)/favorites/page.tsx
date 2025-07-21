import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { removeFavorite } from './actions';
import ToastMessage from '@/components/molecules/ToastMessage';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FavoritesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customerData) {
    console.error('Error fetching customer ID:', customerError);
    return <div>Favoriler yüklenirken bir hata oluştu.</div>;
  }

  const { data: favorites, error: favError } = await supabase
    .from('customer_favorites')
    .select('barber_id, barbers ( name, slug )')
    .eq('customer_id', customerData.id);

  if (favError) {
    console.error('Error fetching favorites:', favError);
    return <div>Favoriler yüklenirken bir hata oluştu.</div>;
  }

  const params = await searchParams;
  const { success, error } = params;

  const getMessage = () => {
    if (success === 'favorite-removed') {
      return { type: 'success' as const, message: 'Favori başarıyla kaldırıldı!' };
    }
    if (error === 'favorite-failed') {
      return { type: 'error' as const, message: 'İşlem sırasında bir hata oluştu.' };
    }
    return null;
  };

  const message = getMessage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favori Berberlerim</h1>

      {message && <ToastMessage type={message.type} message={message.message} />}

      {favorites && favorites.length > 0 ? (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li key={fav.barber_id} className="flex items-center justify-between bg-card p-4 rounded-lg shadow-soft">
              <Link href={`/barber/${fav.barbers?.[0]?.slug}`} className="font-medium hover:underline">
                {fav.barbers?.[0]?.name}
              </Link>
              <form action={removeFavorite}>
                <input type="hidden" name="barberId" value={fav.barber_id} />
                <input type="hidden" name="redirectTo" value="/favorites" />
                <Button variant="destructive" size="sm">Kaldır</Button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Henüz favori berberiniz bulunmamaktadır.</p>
      )}
    </div>
  );
}
