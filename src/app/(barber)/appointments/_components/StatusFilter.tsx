'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StatusFilterProps {
  currentStatus?: string
}

export function StatusFilter({ currentStatus = 'all' }: StatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={currentStatus} onValueChange={handleChange} className="mb-4">
      <TabsList>
        <TabsTrigger value="all">Tümü</TabsTrigger>
        <TabsTrigger value="pending">Bekleyen</TabsTrigger>
        <TabsTrigger value="confirmed">Onaylanan</TabsTrigger>
        <TabsTrigger value="cancelled">Reddedilen</TabsTrigger>
        <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
