'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', e.target.value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (
    key: 'location' | 'service',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Konum"
          aria-label="Konum"
          defaultValue={searchParams.get('location') || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Hizmet"
          aria-label="Hizmet"
          defaultValue={searchParams.get('service') || ''}
          onChange={(e) => handleInputChange('service', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <select
          onChange={handleCategoryChange}
          defaultValue={searchParams.get('category') || 'all'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Kategoriye göre filtrele"
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="erkek_kuaforu">Erkek Kuaförü</option>
          <option value="kadin_kuaforu">Kadın Kuaförü</option>
          <option value="pet_kuaforu">Pet Kuaförü</option>
          <option value="oto_kuaforu">Oto Kuaförü</option>
        </select>
      </div>
    </div>
  );
}
