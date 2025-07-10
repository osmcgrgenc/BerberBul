'use client';
import LandingLayout from "@/components/templates/LandingLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <LandingLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">Giriş yapmanız gerekiyor.</p>
          <Button asChild className="mt-4">
            <a href="/login">Giriş Yap</a>
          </Button>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Profilim</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 w-full max-w-md mx-auto flex flex-col gap-4">
          <div className="text-left">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Ad</div>
            <div className="font-medium text-lg">{user.user_metadata?.name || '-'}</div>
          </div>
          <div className="text-left">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">E-posta</div>
            <div className="font-medium text-lg">{user.email}</div>
          </div>
          <div className="text-left">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Kullanıcı Tipi</div>
            <div className="font-medium text-lg">{user.user_metadata?.role === 'barber' ? 'Berber' : 'Müşteri'}</div>
          </div>
          <Button variant="outline" className="mt-6" onClick={handleLogout}>Çıkış Yap</Button>
        </div>
      </section>
    </LandingLayout>
  );
} 