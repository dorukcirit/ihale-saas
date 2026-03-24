---
description: İnşaat İhale SaaS — Proje kodlama kuralları. Her görevde bu kurallar geçerlidir.
alwaysApply: true
---

# Proje Kuralları

## Genel Prensipler

* Tüm kod **TypeScript strict mode** ile yazılır. `any` tipi yasaktır.
* Validasyon için her zaman **Zod** şeması kullan.
* Tarihler backend'de **UTC** olarak saklanır, frontend'de `tr-TR` locale ile gösterilir.
* Her yeni dosyada JSDoc ile kısa açıklama yaz.
* Console.log bırakma — loglama için merkezi `lib/logger.ts` kullan.

## Kod Stili

* Bileşen isimleri PascalCase: `IhaleKart.tsx`
* Fonksiyon ve değişkenler camelCase: `ihaleBitisTarihi`
* Sabitler UPPER_SNAKE_CASE: `MAX_TEKLIF_SAYISI`
* Türkçe domain terimleri olduğu gibi kullanılabilir (ihale, teklif, firma vb.)
* Her bileşen kendi klasöründe: `components/IhaleKart/index.tsx`

## API & Veri

* API route'ları `/app/api/` altında REST formatında organize edilir.
* Tüm input'lar Zod ile validate edilir, `safeParse` kullan.
* Başarılı response: `{ success: true, data: ... }`
* Hata response: `{ success: false, error: { code, message } }`
* Tüm veritabanı işlemleri `lib/db/` altındaki servis katmanından geçmeli.
* Ham SQL yasaktır — ORM (Prisma veya Supabase client) kullan.

## Güvenlik

* Her API route'da session/auth kontrolü yap, middleware'e güvenme.
* İhale detay verilerini serileştirirken yetki seviyesine göre filtrele (`serializeIhale(ihale, role)`).
* Dosya yüklemelerinde MIME type ve boyut kontrolü yap.
* Kullanıcı girdilerini asla doğrudan SQL'e veya shell'e verme.

## Test

* Her yeni API route için en az 1 happy path + 1 error case testi yaz.
* Test dosyaları: `__tests__/` veya `.test.ts` suffix.
* Kritik iş mantığı (teklif kabulü, ihale kapatma) için mutlaka test yaz.

## Git

* Commit mesajları Türkçe ve açıklayıcı: `feat: ihale oluşturma formu eklendi`
* Branch isimleri: `feature/ihale-listesi`, `fix/auth-middleware`
* Main/production branch'e direkt push yapma.
