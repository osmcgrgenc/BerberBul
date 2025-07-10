'use client';
import LandingLayout from "@/components/templates/LandingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password/confirm"
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Şifre sıfırlama başarısız!");
    } else {
      toast.success("Şifre sıfırlama e-postası gönderildi!");
    }
  };

  return (
    <LandingLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Şifre Sıfırla</h1>
        <form onSubmit={handleReset} className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 flex flex-col gap-5 mt-4">
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
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Şifre Sıfırla"}
          </Button>
        </form>
      </section>
    </LandingLayout>
  );
} 