---
title: "US-002: Berber Hizmet Yönetimi"
labels: ["feature", "barber-panel", "services"]
assignees: []
---

## User Story

Bir berber olarak, sunduğum hizmetleri (ad, süre, fiyat) ekleyebilmeli, düzenleyebilmeli ve silebilmeliyim.

## Kabul Kriterleri

*   Berber paneli üzerinde "Hizmetler" bölümü olmalı.
*   Berber, mevcut hizmetlerini listeleyebilmeli.
*   Berber, yeni bir hizmet ekleyebilmeli (ad, süre, fiyat bilgileriyle).
*   Berber, mevcut bir hizmeti düzenleyebilmeli.
*   Berber, mevcut bir hizmeti silebilmeli.
*   Hizmet ekleme/düzenleme/silme işlemleri sonrası başarılı/başarısız bildirimleri gösterilmeli.

## Ek Notlar

*   `/src/app/(barber)/_components/ServiceForm.tsx` bileşeni bu işlevsellik için kullanılabilir.
*   Supabase'deki `services` tablosu güncellenmeli.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
