
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BlogPostForm, { BlogPostFormValues } from '../../../_components/BlogPostForm';

// Örnek veri. Gerçekte bu, params.id kullanılarak veritabanından fetch edilecek.
const MOCK_POST_DATA: BlogPostFormValues = {
  title: 'Next.js ile Harika Web Siteleri Yapmak',
  slug: 'nextjs-ile-harika-web-siteleri-yapmak',
  content: 'Next.js, React tabanlı, sunucu tarafında render etme (SSR) ve statik site oluşturma (SSG) gibi özellikleri barındıran harika bir frameworktür.',
  author: 'Admin',
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  // ID'ye göre post verisini fetch ettiğimizi varsayalım
  const post = MOCK_POST_DATA; // fetchPostById(params.id)

  const handleUpdatePost = async (data: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);
      const { id } = await params;
      console.log(`Post ${id} güncelleniyor:`, data);
      // Burada veritabanını güncellemek için server action çağrılacak
      // Örnek: await updatePostAction(params.id, data);
      
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Yazı başarıyla güncellendi!');
      
      // Başarılı olunca /manage-blog sayfasına yönlendir
      router.push('/manage-blog');
      
    } catch (error) {
      console.error('Post güncellenirken hata oluştu:', error);
      toast.error('Yazı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Yazıyı Düzenle</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <BlogPostForm 
          initialData={post} 
          onSubmit={handleUpdatePost} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
