"use client";
import NavItem from "@/components/molecules/NavItem";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
        <span className="font-extrabold text-xl text-emerald-600 tracking-tight">BerberBul</span>
        <div className="hidden md:flex items-center gap-6">
          <NavItem href="/">Anasayfa</NavItem>
          {!user && <NavItem href="/login">Giriş</NavItem>}
          {!user && <NavItem href="/signup">Kayıt Ol</NavItem>}
          {user && role === "barber" && <NavItem href="/barber/dashboard">Berber Paneli</NavItem>}
          {user && role === "customer" && <NavItem href="/profile">Profilim</NavItem>}
          {user && <Button variant="ghost" size="sm" onClick={handleLogout}>Çıkış</Button>}
        </div>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden w-64">
              <div className="flex flex-col gap-4 mt-4">
                <NavItem href="/">Anasayfa</NavItem>
                {!user && <NavItem href="/login">Giriş</NavItem>}
                {!user && <NavItem href="/signup">Kayıt Ol</NavItem>}
                {user && role === "barber" && <NavItem href="/barber/dashboard">Berber Paneli</NavItem>}
                {user && role === "customer" && <NavItem href="/profile">Profilim</NavItem>}
                {user && <Button variant="ghost" onClick={handleLogout}>Çıkış</Button>}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tema değiştir"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
