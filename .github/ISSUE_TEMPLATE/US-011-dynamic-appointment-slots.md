---
title: "US-011: Dinamik Randevu Slotları"
labels: ["feature", "appointments", "UX"]
assignees: []
---

## User Story

Randevu slotları, seçilen hizmetin süresine ve berberin çalışma saatlerine göre dinamik olarak belirlenmeli.

## Kabul Kriterleri

*   Müşteri bir hizmet seçtiğinde, o hizmetin süresi dikkate alınarak uygun randevu saatleri gösterilmeli.
*   Berberin çalışma saatleri (US-003) dikkate alınarak sadece müsait saatler gösterilmeli.
*   Randevu planlayıcı (`AppointmentScheduler.tsx`) bu dinamikliği desteklemeli.

## Ek Notlar

*   `/src/components/organisms/AppointmentScheduler.tsx` ve `/src/app/(public)/shop/[slug]/_components/AppointmentBookingForm.tsx` bileşenleri bu işlevsellik için güncellenmeli.
*   Berberin çalışma saatleri ve hizmet süreleri Supabase'den çekilmeli.
