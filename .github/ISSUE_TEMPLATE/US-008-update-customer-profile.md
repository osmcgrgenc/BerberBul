---
title: "US-008: Müşteri Profil Bilgisi Güncelleme"
labels: ["feature", "customer", "profile"]
assignees: []
---

## User Story

Bir müşteri olarak, kendi profil bilgilerimi (ad, soyad, iletişim) güncelleyebilmeliyim.

## Kabul Kriterleri

*   Müşteri paneli üzerinde "Profil Ayarları" veya benzeri bir bölüm olmalı.
*   Müşteri, adını, soyadını, e-posta adresini (eğer değiştirilebilirse) ve diğer iletişim bilgilerini güncelleyebilmeli.
*   Güncelleme işlemi sonrası başarılı/başarısız bildirimleri gösterilmeli.
*   Güncellenen bilgiler veritabanına doğru şekilde kaydedilmeli.

## Ek Notlar

*   `/src/app/(customer)/profile/page.tsx` ve `/src/app/(customer)/_components/CustomerProfileForm.tsx` bileşenleri bu işlevsellik için kullanılabilir.
*   Supabase'deki `customers` tablosu güncellenmeli.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
