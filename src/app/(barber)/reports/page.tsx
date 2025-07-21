import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import KpiCard from './_components/KpiCard'
import ServiceRevenueChart from './_components/ServiceRevenueChart'
import TrendChart from './_components/TrendChart'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: barber } = await supabase
    .from('barbers')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  if (!barber) {
    return <div>Berber bulunamadı.</div>
  }

  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, appointment_time, customer_id, status, services ( name, price )')
    .eq('barber_id', barber.id)
    .gte('appointment_time', start.toISOString())
    .lte('appointment_time', end.toISOString())

  const completed = (appointments || []).filter(a => a.status === 'completed')
  const totalRevenue = completed.reduce((sum, a) => sum + (a.services?.price || 0), 0)
  const totalAppointments = completed.length
  const uniqueCustomers = new Set(completed.map(a => a.customer_id)).size
  const avgTicket = totalAppointments ? totalRevenue / totalAppointments : 0

  const serviceMap = new Map<string, { name: string; total: number; count: number }>()
  completed.forEach(a => {
    const name = a.services?.name
    if (!name) return
    const val = serviceMap.get(name) || { name, total: 0, count: 0 }
    val.total += a.services!.price
    val.count += 1
    serviceMap.set(name, val)
  })
  const serviceData = Array.from(serviceMap.values())

  const dayMap = new Map<string, { date: string; revenue: number; count: number }>()
  completed.forEach(a => {
    const day = format(new Date(a.appointment_time), 'yyyy-MM-dd')
    const val = dayMap.get(day) || { date: day, revenue: 0, count: 0 }
    val.revenue += a.services?.price || 0
    val.count += 1
    dayMap.set(day, val)
  })
  const trendData = Array.from(dayMap.values()).sort((a,b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Raporlar</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Toplam Ciro" value={`₺${totalRevenue.toFixed(2)}`} />
        <KpiCard label="Toplam Randevu" value={totalAppointments} />
        <KpiCard label="Müşteri" value={uniqueCustomers} />
        <KpiCard label="Ort. Sepet" value={`₺${avgTicket.toFixed(2)}`} />
      </div>
      <ServiceRevenueChart data={serviceData} />
      <TrendChart data={trendData} />
    </div>
  )
}
