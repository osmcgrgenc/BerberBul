'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FloatingLabelInput } from '@/components/molecules/FloatingLabelInput'
import { toast } from 'sonner'
import Link from 'next/link' // toast'ı import et

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message) // alert yerine toast.error
    } else {
      router.push('/dashboard')
    }
  }

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message) // alert yerine toast.error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 rounded-2xl shadow-soft bg-card">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <FloatingLabelInput
              id="email-address"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FloatingLabelInput
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-soft"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <div>
          <button
            onClick={handleGitHubLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 shadow-soft"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
