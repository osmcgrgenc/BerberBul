---
title: "US-001: Berber Randevu Yönetimi"
labels: ["feature", "barber-panel", "appointments"]
assignees: []
---

## User Story

Bir berber olarak, randevularımı (onaylama, reddetme, tamamlama) kolayca yönetebilmeliyim.

## Kabul Kriterleri

*   Berber paneli üzerinde "Randevular" bölümü olmalı.
*   Berber, bekleyen randevuları listeleyebilmeli.
*   Berber, her bir randevuyu "Onayla" veya "Reddet" seçenekleriyle güncelleyebilmeli.
*   Onaylanan randevular, tamamlandığında "Tamamlandı" olarak işaretlenebilmeli.
*   Randevu durumu güncellendiğinde kullanıcıya (müşteriye) bildirim gönderilmeli (toast veya e-posta).
*   Randevu listesi, randevu durumuna göre filtrelenebilmeli (Bekleyen, Onaylanan, Reddedilen, Tamamlanan).

## Ek Notlar

*   Mevcut `/src/app/(barber)/appointments/page.tsx` sayfası bu işlevselliği içerecek.
*   Supabase'deki `appointments` tablosu güncellenmeli.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
