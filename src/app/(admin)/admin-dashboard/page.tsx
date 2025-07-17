import React from 'react';
import StatCard from '../_components/StatCard';
import DashboardChart from '../_components/DashboardChart';
import RecentActivity from '../_components/RecentActivity';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// İkonlar için basit yer tutucular. Gerçek projede lucide-react gibi bir kütüphane kullanılabilir.
const UserIcon = () => <span>👥</span>;
const BarberIcon = () => <span>✂️</span>;
const AppointmentIcon = () => <span>📅</span>;
const RevenueIcon = () => <span>💰</span>;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gösterge Paneli</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Kullanıcı" value="1,254" icon={<UserIcon />} />
        <StatCard title="Toplam Berber" value="86" icon={<BarberIcon />} />
        <StatCard title="Bu Ayki Randevular" value="482" icon={<AppointmentIcon />} />
        <StatCard title="Bu Ayki Gelir" value="₺12,450" icon={<RevenueIcon />} />
      </div>

      {/* Grafik ve Son Aktiviteler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/manage-blog/new">Yeni Blog Yazısı Ekle</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/manage-pages/new">Yeni Kurumsal Sayfa Ekle</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}