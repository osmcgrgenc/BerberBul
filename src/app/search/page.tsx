import { createClient } from '@/lib/supabase/server'
import { BarberCard } from '@/components/molecules/BarberCard'
import { MapPin } from 'lucide-react' // İkonlar için

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
      <h1 className="text-4xl font-bold text-center my-8">Find Your Perfect Barber</h1>

      {/* Arama ve Filtreleme Bölümü */}
      <div className="bg-white p-6 rounded-2xl shadow-soft mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Konum Girişi */}
          <div className="relative w-full md:w-1/2">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter location or use current"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Location input"
            />
          </div>

          {/* Filtreler */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-1/2">
            <select
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Filter by service"
            >
              <option value="">Service</option>
              <option value="haircut">Haircut</option>
              <option value="shave">Shave</option>
            </select>
            <select
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Filter by rating"
            >
              <option value="">Rating</option>
              <option value="4+">4+ Stars</option>
              <option value="3+">3+ Stars</option>
            </select>
            <select
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Filter by price"
            >
              <option value="">Price</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Berber Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {barbers.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No barbers found matching your criteria.</p>
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