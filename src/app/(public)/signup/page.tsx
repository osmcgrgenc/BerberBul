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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'customer' | 'barber'>('customer');
  const [name, setName] = useState("");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: {
        data: { 
          name: name,
          role: role
        }
      }
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Kayıt başarısız!");
    } else if (data.user) {
      toast.success("Kayıt başarılı! Hesabınızı doğrulamak için lütfen e-postanızı kontrol edin.");
      // Yönlendirme, kullanıcı e-postasını doğruladıktan sonra login sayfasında gerçekleşecek.
      // İsteğe bağlı olarak kullanıcıyı login sayfasına yönlendirebilirsiniz.
      router.push("/login");
    }
  };

  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Kayıt Ol</h1>
        <form onSubmit={handleSignup} className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 flex flex-col gap-5 mt-4">
          <div className="text-left">
            <Label htmlFor="name">Adınız</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adınız"
              className="mt-1"
            />
          </div>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>
          <div className="text-left">
            <Label>Kayıt Tipi</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="accent-emerald-600"
                />
                <span>Müşteri</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="barber"
                  checked={role === 'barber'}
                  onChange={() => setRole('barber')}
                  className="accent-emerald-600"
                />
                <span>Berber</span>
              </label>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
          </Button>
        </form>
        <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="text-emerald-600 dark:text-emerald-300 hover:underline font-medium">Giriş Yap</Link>
        </p>
      </section>
    </LandingLayout>
  );
} 