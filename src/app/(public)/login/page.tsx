'use client';
import LandingLayout from "@/components/templates/LandingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Giriş başarısız!");
    } else if (user) {
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
      const { data: berber, error: berberError } = await supabase
        .from('berber')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (berberError) {
        toast.error(berberError.message || "Giriş başarısız!");
      }
      if (berber) {
        router.push("/berber/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Giriş Yap</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 flex flex-col gap-5 mt-4">
          <div className="text-left">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
              className="mt-1"
            />
          </div>
          <div className="text-left">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
        <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Hesabın yok mu?{' '}
          <Link href="/signup" className="text-emerald-600 dark:text-emerald-300 hover:underline font-medium">Kayıt Ol</Link>
        </p>
      </section>
    </LandingLayout>
  );
} 