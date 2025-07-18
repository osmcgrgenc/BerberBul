---
title: "US-005: Berber Yorum Yönetimi"
labels: ["feature", "barber-panel", "reviews"]
assignees: []
---

## User Story

Bir berber olarak, müşterilerimin hakkımdaki yorumlarını görüntüleyebilmeli ve yanıtlayabilmeliyim.

## Kabul Kriterleri

*   Berber paneli üzerinde "Yorumlar" bölümü olmalı.
*   Berber, kendisine yapılan tüm yorumları listeleyebilmeli.
*   Her yorum için müşterinin adı, yorum metni ve puanı görünmeli.
*   Berber, her yoruma yanıt yazabilmeli.
*   Yorum yanıtları berberin profil sayfasında yorumun altında görünmeli.
*   Yorum yönetimi işlemleri sonrası başarılı/başarısız bildirimleri gösterilmeli.

## Ek Notlar

*   Supabase'de yorumlar ve yorum yanıtları için uygun bir tablo yapısı oluşturulmalı.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
*   Berber profil sayfasındaki yorum bölümü (`/barber/[id]`) bu işlevsellikle doldurulmalı.
