---
title: "US-010: Randevu Çakışma Kontrolü"
labels: ["feature", "appointments", "validation"]
assignees: []
---

## User Story

Sistem, aynı saat diliminde çakışan randevuları otomatik olarak engellemeli ve kullanıcıya bildirmeli.

## Kabul Kriterleri

*   Müşteri randevu oluşturmaya çalıştığında, seçilen berberin o saatte başka bir randevusu olup olmadığı kontrol edilmeli.
*   Eğer çakışma varsa, kullanıcıya anlaşılır bir hata mesajı gösterilmeli.
*   Çakışan randevu oluşturulması engellenmeli.

## Ek Notlar

*   Randevu oluşturma API'sinde (muhtemelen `/src/app/(public)/shop/[slug]/actions.ts` veya benzeri) bu kontrol yapılmalı.
*   Supabase'deki `appointments` tablosu sorgulanarak çakışma tespiti yapılmalı.
