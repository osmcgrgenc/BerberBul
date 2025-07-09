import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';

interface BarberCardProps {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
}

export function BarberCard({ id, name, description, address }: BarberCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {address && <p className="text-sm text-gray-500">{address}</p>}
        <Link href={`/barber/${id}`} className="text-blue-500 hover:underline mt-4 block">
          View Profile
        </Link>
      </CardContent>
    </Card>
  );
}
