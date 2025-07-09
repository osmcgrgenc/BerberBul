'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TenantContextType {
  tenantId: string | null
  tenantSlug: string | null
  loading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [tenantSlug, setTenantSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getTenantInfo() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Sunucu tarafından ayarlanan çerezleri okuyun
        const tenantIdCookie = document.cookie.split('; ').find(row => row.startsWith('tenantId='))?.split('=')[1]
        const tenantSlugCookie = document.cookie.split('; ').find(row => row.startsWith('tenantSlug='))?.split('=')[1]
        setTenantId(tenantIdCookie || null)
        setTenantSlug(tenantSlugCookie || null)
      }
      setLoading(false)
    }

    getTenantInfo()
  }, [supabase])

  return (
    <TenantContext.Provider value={{ tenantId, tenantSlug, loading }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
