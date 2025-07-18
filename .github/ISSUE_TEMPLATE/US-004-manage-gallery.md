---
title: "US-004: Berber Galeri Yönetimi"
labels: ["feature", "barber-panel", "media"]
assignees: []
---

## User Story

Bir berber olarak, profilime fotoğraf yükleyebilmeli ve galerimi yönetebilmeliyim.

## Kabul Kriterleri

*   Berber paneli üzerinde "Galeri" veya "Medya" bölümü olmalı.
*   Berber, yeni fotoğraflar yükleyebilmeli.
*   Yüklenen fotoğraflar berberin profil sayfasında görüntülenebilmeli.
*   Berber, mevcut fotoğrafları silebilmeli.
*   Fotoğraf yükleme/silme işlemleri sonrası başarılı/başarısız bildirimleri gösterilmeli.

## Ek Notlar

*   Supabase Storage veya benzeri bir depolama çözümü kullanılmalı.
*   Supabase'de galeri görselleri için uygun bir tablo yapısı oluşturulmalı.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
*   Berber profil sayfasındaki galeri yer tutucusu (`/barber/[id]`) bu işlevsellikle doldurulmalı.
