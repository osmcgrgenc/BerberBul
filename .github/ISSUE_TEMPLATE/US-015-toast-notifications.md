---
title: "US-015: Uygulama Geneli Toast Bildirimleri"
labels: ["enhancement", "UI/UX", "notifications"]
assignees: []
---

## User Story

Uygulama genelinde başarılı işlemler, hatalar ve uyarılar için tutarlı toast bildirimleri gösterilmeli.

## Kabul Kriterleri

*   Kullanıcı bir işlem gerçekleştirdiğinde (örn. form gönderme, randevu oluşturma), işlemin sonucuna göre (başarılı, hata, uyarı) uygun bir toast bildirimi gösterilmeli.
*   Bildirimler kullanıcıyı bilgilendirici ve anlaşılır olmalı.
*   `Sonner` kütüphanesi bu amaçla kullanılmalı.

## Ek Notlar

*   Mevcut formlar ve aksiyonlar (`actions.ts` dosyaları) toast bildirimlerini tetikleyecek şekilde güncellenmeli.
