import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BarberCardProps {
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  category: string | null;
}

const categoryTranslations: { [key: string]: string } = {
  erkek_kuaforu: 'Erkek Kuaförü',
  kadin_kuaforu: 'Kadın Kuaförü',
  pet_kuaforu: 'Pet Kuaförü',
  oto_kuaforu: 'Oto Kuaförü',
};

export function BarberCard({ slug, name, description, address, category }: BarberCardProps) {
  return (
    <Link href={`/barber/${slug}`} className="block hover:scale-105 transition-transform duration-200">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow">
          {address && <p className="text-sm text-gray-500">{address}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
            {category && <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{categoryTranslations[category] || category}</span>}
            <span className="text-blue-500 hover:underline text-sm">
              Profili Görüntüle
            </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
