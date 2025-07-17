
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, FileText, Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Örnek veri. Gerçekte bu veritabanından gelecek.
const pages = [
  {
    slug: 'hakkimizda',
    title: 'Hakkımızda',
    updatedAt: '2024-07-10',
    status: 'published',
    views: 850,
  },
  {
    slug: 'iletisim',
    title: 'İletişim',
    updatedAt: '2024-06-25',
    status: 'published',
    views: 1200,
  },
  {
    slug: 'kvkk',
    title: 'KVKK ve Gizlilik Politikası',
    updatedAt: '2024-07-18',
    status: 'draft',
    views: 450,
  },
  {
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    updatedAt: '2024-07-05',
    status: 'published',
    views: 320,
  },
];

// Silme işlemi için bir server action
async function deletePage(formData: FormData) {
  'use server';
  const slug = formData.get('slug') as string;
  console.log(`Sayfa ${slug} siliniyor...`);
  // Burada veritabanından silme işlemi yapılacak
  // revalidatePath('/manage-pages'); // Sayfayı yeniden doğrula
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

export default function ManagePages() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kurumsal Sayfaları Yönet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kurumsal sayfalarınızı buradan yönetebilirsiniz</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/manage-pages/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Sayfa Ekle
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Sayfa</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yayında</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pages.filter(p => p.status === 'published').length}
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
                  {pages.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Kurumsal Sayfalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Sayfa Başlığı</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">URL (slug)</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Son Güncelleme</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Durum</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Görüntülenme</th>
                  <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.slug} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{page.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Slug: {page.slug}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">/{page.slug}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {format(new Date(page.updatedAt), 'dd MMM yyyy', { locale: tr })}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(page.status)}
                    </td>
                    <td className="p-3">
                      <span className="text-gray-700 dark:text-gray-300">{page.views.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/manage-pages/edit/${page.slug}`} className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Düzenle
                          </Link>
                        </Button>
                        <form action={deletePage} className="inline">
                          <input type="hidden" name="slug" value={page.slug} />
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

          {pages.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Henüz kurumsal sayfa bulunmamaktadır.</p>
              <Button asChild className="mt-4">
                <Link href="/manage-pages/new">İlk Sayfanızı Oluşturun</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
