
import React from 'react';
import EditHomepageForm from '../_components/EditHomepageForm';

export default function EditHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ana Sayfa İçeriklerini Düzenle</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hero Alanı</h2>
        <EditHomepageForm />
      </div>
    </div>
  );
}
