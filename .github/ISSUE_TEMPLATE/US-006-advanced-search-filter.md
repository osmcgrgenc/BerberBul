---
title: "US-006: Gelişmiş Berber Arama ve Filtreleme"
labels: ["feature", "customer", "search"]
assignees: []
---

## User Story

Bir müşteri olarak, konumuma, hizmete ve berber türüne göre berberleri gelişmiş filtrelerle arayabilmeliyim.

## Kabul Kriterleri

*   Arama sayfasında (`/search`) konum girişi olmalı.
*   Konum bilgisine göre berberler filtrelenebilmeli.
*   Hizmet türüne göre filtreleme seçeneği olmalı.
*   Berber türüne (erkek, kadın, pet, oto kuaför) göre filtreleme seçeneği olmalı.
*   Birden fazla filtre aynı anda uygulanabilmeli.
*   Filtreler uygulandığında arama sonuçları dinamik olarak güncellenmeli.

## Ek Notlar

*   `/src/app/(public)/search/page.tsx` ve `/src/app/(public)/search/_components/SearchForm.tsx` bileşenleri bu işlevsellik için kullanılabilir.
*   Supabase'deki berber ve hizmet verileri bu filtrelemeyi destekleyecek şekilde sorgulanmalı.
*   Coğrafi konum tabanlı arama için ek entegrasyonlar gerekebilir (örneğin, PostGIS).
