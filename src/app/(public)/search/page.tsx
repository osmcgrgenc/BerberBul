import { createClient } from '@/lib/supabase/server';
import { BarberCard } from '@/components/molecules/BarberCard';
import { SearchForm } from './_components/SearchForm';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const category = params.category as string || 'all';
  const location = params.location as string | undefined;
  const service = params.service as string | undefined;

  let query = supabase
    .from('barbers')
    .select('id, name, slug, bio, address, category, services(name)');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (location) {
    query = query.ilike('address', `%${location}%`);
  }

  if (service) {
    query = query.ilike('services.name', `%${service}%`);
  }

  const { data: barbers, error } = await query;

  if (error) {
    console.error('Error fetching barbers:', error);
    return <div className="text-center mt-8 text-red-500">Error loading barbers.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Mükemmel Berberini Bul</h1>

      <SearchForm />

      {/* Berber Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {barbers.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">Kriterlerinize uygun berber bulunamadı.</p>
        ) : (
          barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              slug={barber.slug}
              name={barber.name}
              description={barber.bio} // bio alanını kullanıyoruz
              address={barber.address}
              category={barber.category}
            />
          ))
        )}
      </div>
    </div>
  );
}