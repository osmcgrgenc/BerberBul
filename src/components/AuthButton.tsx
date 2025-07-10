'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { User as UserIcon, LogOut } from 'lucide-react'

export default function AuthButton() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Yükleniyor...</span>
      </div>
    )
  }

  return user ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
        <UserIcon size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-secondary-foreground">
          {user.email?.split('@')[0]}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <LogOut size={16} />
        Çıkış
      </button>
    </div>
  ) : (
    <a
      href="/login"
      className="btn-primary text-sm"
    >
      Giriş Yap
    </a>
  )
}
