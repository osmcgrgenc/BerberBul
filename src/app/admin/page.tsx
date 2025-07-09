import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Basit bir yönetici kontrolü: Sadece belirli bir e-posta adresine sahip kullanıcılar yönetici olabilir.
  // Gerçek bir uygulamada, kullanıcı rolleri için ayrı bir tablo veya Supabase RLS kullanmalısınız.
  if (!user || user.email !== 'admin@example.com') { // Yönetici e-postasını buraya yazın
    return redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to the Admin Panel, {user.email}!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This is a protected admin route.
          </p>
        </div>
      </div>
    </div>
  )
}
