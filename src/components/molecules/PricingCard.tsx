'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/Card';

interface PricingCardProps {
  planName: string;
  price: string;
  period: string;
  features: string[];
  onSubscribe: () => void;
  disabled: boolean;
}

export function PricingCard({ planName, price, period, features, onSubscribe, disabled }: PricingCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{planName}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-gray-500">/{period}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <form action={onSubscribe} className="w-full">
             <Button className="w-full" disabled={disabled}>
                Abone Ol
             </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
