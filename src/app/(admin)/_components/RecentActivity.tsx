
import React from 'react';

// Örnek veri
const activities = [
  { id: 1, type: 'new_user', description: 'Ahmet Y. sisteme kaydoldu.', time: '5 dakika önce' },
  { id: 2, type: 'new_appointment', description: 'Mehmet K. için yeni randevu oluşturuldu.', time: '15 dakika önce' },
  { id: 3, type: 'new_barber', description: 'Saloon Shine sisteme katıldı.', time: '1 saat önce' },
  { id: 4, type: 'new_review', description: 'Ayşe F. bir yorum bıraktı.', time: '3 saat önce' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-80">
      <h3 className="text-lg font-semibold mb-4">Son Aktiviteler</h3>
      <ul className="space-y-4">
        {activities.map(activity => (
          <li key={activity.id} className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                {activity.type === 'new_user' ? 'U' : activity.type === 'new_appointment' ? 'R' : 'B'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
