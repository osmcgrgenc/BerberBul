'use client';
import LandingLayout from "@/components/templates/LandingLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
        <h1 className="text-6xl font-extrabold mb-4 text-emerald-600 dark:text-emerald-300">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Sayfa Bulunamadı</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Button asChild variant="default" size="lg">
          <Link href="/">Anasayfaya Dön</Link>
        </Button>
      </section>
    </LandingLayout>
  );
} 