
import React from 'react';

export default function EnterpriseLayout({
  children,
}: { 
  children: React.ReactNode; 
}) {
  return (
    <div className="container mx-auto p-4">
      {/* Kurumsal sayfalara özel bir başlık veya navigasyon buraya gelebilir */}
      {children}
      {/* Kurumsal sayfalara özel bir altbilgi buraya gelebilir */}
    </div>
  );
}
