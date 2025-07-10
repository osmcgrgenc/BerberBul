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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
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
