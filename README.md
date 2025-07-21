# BerberBul

BerberBul, berberler (erkek, kadın, pet, oto kuaförleri) ile müşterileri bir araya getiren modern bir randevu ve profil yönetim platformudur. Berberler aylık/yıllık aboneliklerle platforma katılarak kendilerini, hizmetlerini ve çalışma saatlerini tanıtabilir, müşterilerden randevu alabilir ve yorumları yönetebilirler. Müşteriler ise konumlarına, hizmetlere veya berber türüne göre arama yaparak kolayca randevu oluşturabilir.

## Özellikler

-   **Rol Bazlı Paneller:** Berberler ve müşteriler için ayrı, güvenli ve kullanıcı dostu paneller.
-   **Berber Profil Yönetimi:** Berberlerin kendi profillerini (bio, kategori, adres, çalışma saatleri) güncelleyebilmesi.
-   **SEO Odaklı Berber Sayfaları:** Her berber için arama motoru dostu, herkese açık profil sayfaları.
-   **Gelişmiş Arama ve Filtreleme:** Müşterilerin berberleri kategoriye, konuma ve hizmete göre arayabilmesi.
-   **Abonelik Sistemi:** Berberler için abonelik yönetimi ve planları (sahte entegrasyon).
-   **Randevu Sistemi:** Müşterilerin hizmet seçerek randevu alabilmesi, berberlerin randevuları yönetebilmesi (onaylama, reddetme, tamamlama).
-   **Değerlendirme ve Yorum Sistemi:** Müşterilerin tamamlanmış randevular sonrası berberleri değerlendirebilmesi ve yorum yapabilmesi.
-   **Personel Yönetimi:** İşletme sahiplerinin çalışan ekleyip roller atayabildiği personel modülü.

## Teknolojiler

-   **Next.js 14 (App Router):** Modern React uygulamaları için güçlü bir çerçeve.
-   **Supabase:** Kimlik doğrulama (Auth) ve veritabanı (PostgreSQL) hizmetleri.
-   **Tailwind CSS:** Hızlı ve esnek UI geliştirme için utility-first CSS çerçevesi.
-   **TypeScript:** Güvenli ve ölçeklenebilir kod yazımı için.
-   **date-fns:** Tarih ve saat işlemleri için hafif kütüphane.
-   **Sonner:** Toast bildirimleri için.

## Kurulum ve Çalıştırma

### Önkoşullar

-   Node.js (v18.x veya üzeri)
-   pnpm (önerilir)
-   Supabase hesabı ve projesi

### Adımlar

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/your-username/berberbul-app.git
    cd berberbul-app
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    pnpm install
    ```

3.  **Ortam Değişkenlerini Yapılandırın:**
    `.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase API anahtarlarınızı ve diğer gerekli bilgileri doldurun.
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Supabase Şemasını Uygulayın:**
    `supabase_schema.sql` dosyasındaki SQL komutlarını Supabase projenizin SQL Editor'ünde çalıştırarak veritabanı şemasını oluşturun.

5.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    pnpm dev
    ```

6.  Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen bir pull request göndermeden önce katkı yönergelerimizi okuyun.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
