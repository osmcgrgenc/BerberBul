---
title: "US-003: Berber Çalışma Saatleri Yönetimi"
labels: ["feature", "barber-panel", "working-hours"]
assignees: []
---

## User Story

Bir berber olarak, çalışma saatlerimi (günlük, özel günler) detaylı bir şekilde ayarlayabilmeliyim.

## Kabul Kriterleri

*   Berber paneli üzerinde "Çalışma Saatleri" bölümü olmalı.
*   Berber, haftanın her günü için açılış ve kapanış saatlerini belirleyebilmeli.
*   Berber, belirli tarihler için (tatil, özel durumlar) çalışma saatlerini geçersiz kılabilecek özel saatler tanımlayabilmeli.
*   Çalışma saatleri kaydedildiğinde başarılı/başarısız bildirimleri gösterilmeli.
*   Müşteriler, berberin profil sayfasında güncel çalışma saatlerini görebilmeli.

## Ek Notlar

*   `/src/app/(barber)/working-hours/page.tsx` ve `/src/app/(barber)/working-hours/_components/WorkingHoursForm.tsx` bileşenleri bu işlevsellik için kullanılabilir.
*   Supabase'de çalışma saatleri için uygun bir tablo yapısı oluşturulmalı veya mevcut tablo güncellenmeli.
*   Gerekli backend (Supabase fonksiyonları veya Next.js API rotaları) geliştirilmeli.
