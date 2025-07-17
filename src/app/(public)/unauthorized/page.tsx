'use client';
import LandingLayout from "@/components/templates/LandingLayout";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-6 p-4 rounded-full bg-red-100 dark:bg-red-900/20">
          <ShieldX className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Yetkisiz Erişim
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen giriş yapın veya farklı bir hesap kullanın.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/login">Giriş Yap</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Anasayfaya Dön</Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
} 