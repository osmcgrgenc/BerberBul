
'use client';

import React from 'react';
import BlogPostForm, { BlogPostFormValues } from '../../_components/BlogPostForm';

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreatePost = async (data: BlogPostFormValues) => {
    setIsSubmitting(true);
    console.log('Yeni yazı oluşturuluyor:', data);
    // Burada veritabanına ekleme işlemi için server action çağrılacak
    // Örnek: await createPostAction(data);
    setIsSubmitting(false);
    alert('Yazı başarıyla oluşturuldu! (Konsolu kontrol edin)');
    // Başarılı olunca /manage-blog sayfasına yönlendir
    // window.location.href = '/manage-blog';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yeni Blog Yazısı Ekle</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <BlogPostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
