
'use client';

import React from 'react';
import StaticPageForm, { StaticPageFormValues } from '../../_components/StaticPageForm';

export default function NewStaticPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreatePage = async (data: StaticPageFormValues) => {
    setIsSubmitting(true);
    console.log('Yeni sayfa oluşturuluyor:', data);
    // Veritabanına ekleme işlemi...
    setIsSubmitting(false);
    alert('Sayfa başarıyla oluşturuldu! (Konsolu kontrol edin)');
    // window.location.href = '/manage-pages';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yeni Kurumsal Sayfa Ekle</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <StaticPageForm onSubmit={handleCreatePage} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
