
'use client';

import React from 'react';
import StaticPageForm, { StaticPageFormValues } from '../../../_components/StaticPageForm';

// Örnek veri. Gerçekte bu, params.slug kullanılarak veritabanından fetch edilecek.
const MOCK_PAGE_DATA: StaticPageFormValues = {
  title: 'Hakkımızda',
  slug: 'hakkimizda',
  content: 'BerberBul, 2025 yılında kurulmuş, insanları en iyi berberlerle buluşturan bir platformdur...',
};

export default function EditStaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Slug'a göre sayfa verisini fetch ettiğimizi varsayalım
  const page = MOCK_PAGE_DATA; // fetchPageBySlug(params.slug)

  const handleUpdatePage = async (data: StaticPageFormValues) => {
    setIsSubmitting(true);
    const { slug } = await params;
    console.log(`Sayfa ${slug} güncelleniyor:`, data);
    // Veritabanını güncelleme işlemi...
    setIsSubmitting(false);
    alert('Sayfa başarıyla güncellendi! (Konsolu kontrol edin)');
    // window.location.href = '/manage-pages';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sayfayı Düzenle: {page.title}</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <StaticPageForm 
          initialData={page} 
          onSubmit={handleUpdatePage} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
