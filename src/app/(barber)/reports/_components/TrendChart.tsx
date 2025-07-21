'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

interface DataItem {
  date: string;
  revenue: number;
  count: number;
}

export default function TrendChart({ data }: { data: DataItem[] }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Günlük Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Ciro" stroke="#0ea5e9" />
          <Line type="monotone" dataKey="count" name="Randevu" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
