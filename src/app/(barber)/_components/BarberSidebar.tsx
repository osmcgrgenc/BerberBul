
import Link from "next/link";
import React from "react";

export default function BarberSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Berber Paneli</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/barber-dashboard" className="hover:text-blue-400 transition-colors">
              Gösterge Paneli
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/appointments" className="hover:text-blue-400 transition-colors">
              Randevu Takvimi
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/services" className="hover:text-blue-400 transition-colors">
              Hizmetler
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/settings" className="hover:text-blue-400 transition-colors">
              Dükkan Ayarları
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/working-hours" className="hover:text-blue-400 transition-colors">
              Çalışma Saatleri
            </Link>
          </li>
           <li className="mb-2">
            <Link href="/subscription" className="hover:text-blue-400 transition-colors">
              Abonelik
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
