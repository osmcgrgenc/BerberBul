
'use client';

import React from 'react';

// Bu, gelecekte bir grafik kütüphanesi ile değiştirilecek bir yer tutucudur.
export default function DashboardChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Kullanıcı Kayıt Grafiği</h3>
        <p className="text-gray-500">(Grafik Kütüphanesi Entegre Edilecek)</p>
        {/* Örnek bir SVG grafik temsili */}
        <svg viewBox="0 0 100 50" className="w-full h-auto mt-4">
          <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,45 10,35 20,40 30,25 40,30 50,20 60,25 70,15 80,20 90,10 100,5" />
        </svg>
      </div>
    </div>
  );
}
