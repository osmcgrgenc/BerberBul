
import React from "react";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main id="content" className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
