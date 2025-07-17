
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Örnek veri. Gerçekte bu veritabanından gelecek.
const posts = [
  {
    id: '1',
    title: 'Next.js ile Harika Web Siteleri Yapmak',
    author: 'Admin',
    createdAt: '2024-07-18',
    status: 'published',
    views: 1250,
  },
  {
    id: '2',
    title: 'Tailwind CSS İpuçları ve Best Practices',
    author: 'Admin',
    createdAt: '2024-07-15',
    status: 'draft',
    views: 890,
  },
  {
    id: '3',
    title: 'React 19 Yeni Özellikleri',
    author: 'Admin',
    createdAt: '2024-07-12',
    status: 'published',
    views: 2100,
  },
];

// Silme işlemi için bir server action
async function deletePost(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  console.log(`Post ${id} siliniyor...`);
  // Burada veritabanından silme işlemi yapılacak
  // revalidatePath('/manage-blog'); // Sayfayı yeniden doğrula
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Yayında</Badge>;
    case 'draft':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Taslak</Badge>;
    default:
      return <Badge variant="outline">Bilinmiyor</Badge>;
  }
};

export default function ManageBlogPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog Yazılarını Yönet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Blog içeriklerinizi buradan yönetebilirsiniz</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/manage-blog/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Yazı</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yayında</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taslak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Blog Yazıları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Başlık</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Yazar</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Tarih</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Durum</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Görüntülenme</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{post.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {post.id}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{post.author}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {format(new Date(post.createdAt), 'dd MMM yyyy', { locale: tr })}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="p-3">
                      <span className="text-gray-700 dark:text-gray-300">{post.views.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/manage-blog/edit/${post.id}`} className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Düzenle
                          </Link>
                        </Button>
                        <form action={deletePost} className="inline">
                          <input type="hidden" name="id" value={post.id} />
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            type="submit"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Sil
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Henüz blog yazısı bulunmamaktadır.</p>
              <Button asChild className="mt-4">
                <Link href="/manage-blog/new">İlk Yazınızı Oluşturun</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
