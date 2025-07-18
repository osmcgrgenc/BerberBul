---
title: "US-012: Randevu Fiyat Gösterimi"
labels: ["feature", "appointments", "UX"]
assignees: []
---

## User Story

Randevu rezervasyonu sırasında hizmet fiyatları net bir şekilde gösterilmeli.

## Kabul Kriterleri

*   Müşteri bir hizmet seçtiğinde, o hizmetin fiyatı randevu formunda açıkça görünmeli.
*   Birden fazla hizmet seçildiğinde toplam fiyat hesaplanıp gösterilmeli.

## Ek Notlar

*   `/src/app/(public)/shop/[slug]/_components/AppointmentBookingForm.tsx` bileşeni güncellenmeli.
*   Hizmet fiyatları Supabase'den çekilmeli.
