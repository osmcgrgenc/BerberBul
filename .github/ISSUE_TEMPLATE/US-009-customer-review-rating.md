---
title: "US-009: Müşteri Yorum ve Puanlama Sistemi"
labels: ["feature", "customer", "reviews"]
assignees: []
---

## User Story

Bir müşteri olarak, tamamladığım randevular sonrası berberime yorum yapabilmeli ve puan verebilmeliyim.

## Kabul Kriterleri

*   Tamamlanmış randevuların listelendiği bir bölümde (örn. "Geçmiş Randevularım") yorum yapma seçeneği olmalı.
*   Müşteri, berbere 1-5 arası puan verebilmeli.
*   Müşteri, berber hakkında metin tabanlı bir yorum yazabilmeli.
*   Yorum ve puanlama işlemi sonrası başarılı/başarısız bildirimleri gösterilmeli.
*   Yapılan yorumlar berberin profil sayfasında görünmeli.

## Ek Notlar

*   `/src/components/molecules/ReviewForm.tsx` bileşeni bu işlevsellik için kullanılabilir.
*   Supabase'de yorumlar ve puanlar için uygun bir tablo yapısı oluşturulmalı.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
