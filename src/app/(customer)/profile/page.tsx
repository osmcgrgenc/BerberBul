'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useState, useActionState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import type { User } from '@supabase/supabase-js';
import CustomerProfileForm from '../_components/CustomerProfileForm';
import { updateCustomerProfile, type CustomerProfileFormValues } from '../actions';
import { toast } from 'sonner';
import Link from "next/link";

const initialState = {
  message: '',
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<CustomerProfileFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateCustomerProfile, initialState);

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          toast.error('Kullanıcı bilgileri alınamadı.');
          return;
        }

        setUser(user);

        if (user) {
          const { data: customerProfile, error: profileError } = await supabase
            .from('customers')
            .select('name, email, phone')
            .eq('user_id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching customer profile:', profileError);
            toast.error('Profil bilgileri yüklenirken bir hata oluştu.');
          } else if (customerProfile) {
            setCustomerData(customerProfile);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Beklenmeyen bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    getUserAndProfile();

    // Session değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setCustomerData(null);
          router.push('/');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          // Yeni kullanıcı için profil bilgilerini yükle
          const { data: customerProfile, error } = await supabase
            .from('customers')
            .select('name, email, phone')
            .eq('user_id', session.user.id)
            .single();

          if (!error && customerProfile) {
            setCustomerData(customerProfile);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('hata')) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Çıkış yapılırken bir hata oluştu.');
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Beklenmeyen bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Giriş yapmanız gerekiyor.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Giriş Yap</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-8 duration-700">
      <h1 className="text-3xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Profilim</h1>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 w-full max-w-md mx-auto flex flex-col gap-4">
        {customerData ? (
          <CustomerProfileForm initialData={customerData} onSubmit={formAction} isSubmitting={isPending} />
        ) : (
          <p>Profil bilgileri yükleniyor...</p>
        )}
        <Button variant="outline" className="mt-6" onClick={handleLogout}>Çıkış Yap</Button>
      </div>
    </section>
  );
}