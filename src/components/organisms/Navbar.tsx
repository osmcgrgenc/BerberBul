"use client";
import NavItem from "@/components/molecules/NavItem";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Öncelik user_metadata'daki role, yoksa veritabanı sorgusu yapılabilir
        setRole(user.user_metadata?.role || null);
      } else {
        setRole(null);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/");
  };

  return (
    <nav className="w-full py-3 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-extrabold text-xl text-emerald-600 tracking-tight">BerberBul</span>
          <NavItem href="/">Anasayfa</NavItem>
          {!user && <NavItem href="/login">Giriş</NavItem>}
          {!user && <NavItem href="/signup">Kayıt Ol</NavItem>}
          {user && role === "barber" && <NavItem href="/barber/dashboard">Berber Paneli</NavItem>}
          {user && role === "customer" && <NavItem href="/profile">Profilim</NavItem>}
          {user && <Button variant="ghost" size="sm" onClick={handleLogout}>Çıkış</Button>}
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Tema değiştir"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </Button>
      </div>
    </nav>
  );
} 