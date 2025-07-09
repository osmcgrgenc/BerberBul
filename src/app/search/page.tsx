import { createClient } from '@/lib/supabase/server'
import { BarberCard } from '@/components/molecules/BarberCard' // BarberCard'ı import et

interface Barber {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
}

export default async function SearchPage() {
  const supabase = await createClient();
  const { data: barbers, error } = await supabase.from('barbers').select('*');

  if (error) {
    console.error('Error fetching barbers:', error);
    return <div className="text-center mt-8 text-red-500">Error loading barbers.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Find a Barber</h1>
      {/* Arama formu buraya gelecek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {barbers.length === 0 ? (
          <p className="col-span-full text-center">No barbers found.</p>
        ) : (
          barbers.map((barber: Barber) => (
            <BarberCard
              key={barber.id}
              id={barber.id}
              name={barber.name}
              description={barber.description}
              address={barber.address}
            />
          ))
        )}
      </div>
    </div>
  );
}