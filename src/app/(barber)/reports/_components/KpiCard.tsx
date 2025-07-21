'use client'

interface KpiCardProps {
  label: string;
  value: string | number;
}

export default function KpiCard({ label, value }: KpiCardProps) {
  return (
    <div className="bg-card p-4 rounded-lg shadow text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-muted-foreground text-sm mt-1">{label}</div>
    </div>
  );
}
