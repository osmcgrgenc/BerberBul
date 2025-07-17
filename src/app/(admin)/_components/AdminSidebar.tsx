
import Link from "next/link";
import React from "react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Paneli</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/admin-dashboard" className="hover:text-emerald-400 transition-colors">
              Gösterge Paneli
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/edit-home" className="hover:text-emerald-400 transition-colors">
              Ana Sayfa Düzenle
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/manage-blog" className="hover:text-emerald-400 transition-colors">
              Blog Yönetimi
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/manage-pages" className="hover:text-emerald-400 transition-colors">
              Sayfa Yönetimi
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
