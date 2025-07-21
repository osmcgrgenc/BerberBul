'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface DataItem {
  name: string;
  total: number;
  count: number;
}

export default function ServiceRevenueChart({ data }: { data: DataItem[] }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Hizmet Gelirleri</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="total" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
