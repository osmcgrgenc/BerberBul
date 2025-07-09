'use client'

import { useTenant } from '@/context/TenantContext'
import Link from 'next/link'

export default function Home() {
  const { tenantId, tenantSlug, loading } = useTenant()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tenant info...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Welcome to Berberbul
      </h1>
      {tenantSlug ? (
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          You are currently viewing the page for tenant: <span className="font-bold text-indigo-600">{tenantSlug}</span> (ID: {tenantId}).
          This is a multi-tenant SaaS barber booking platform.
        </p>
      ) : (
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          This is the main landing page for Berberbul. You can search for barbers or log in.
          Try navigating to a subdomain like <span className="font-bold text-indigo-600">ahmetkuafor.localhost:3000</span> to see a tenant-specific page.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
          Find a Barber
        </Link>
        <Link href="/dashboard" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
          Go to Dashboard
        </Link>
      </div>

      <div className="text-sm text-gray-500">
        <p>Already a member? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link></p>
        <p>New here? <Link href="/signup" className="text-blue-600 hover:underline">Create an account</Link></p>
      </div>
    </div>
  )
}