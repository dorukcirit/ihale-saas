---
description: Agent'ın yapmaması veya onay almadan yapmaması gereken işlemler.
alwaysApply: true
---

# Sınırlar (Boundaries)

## ❌ Kesinlikle Yapma

* Veritabanı şemasını (migration) **onay almadan** değiştirme veya silme.
* `.env` veya `.env.local` dosyalarına gerçek secret/key yazma.
* `main` veya `production` branch'e doğrudan commit atma.
* Kullanıcı verilerini (firma bilgisi, teklif detayı) log'a veya console'a yazdırma.
* Stripe webhook'larını test olmadan production'a alma.
* Rol kontrolü olmayan ihale detay endpoint'i oluşturma.
* `supabase.auth.admin` metodlarını kullanıcı taraflı kodda kullanma.

## ⚠️ Onay Gerektiren İşlemler

* Yeni bir veritabanı tablosu veya kolonu ekleme.
* Mevcut bir API endpoint'inin response yapısını değiştirme.
* Abonelik/ödeme akışında değişiklik.
* E-posta şablonlarını güncelleme.
* Kullanıcıya gösterilen veri alanlarını genişletme (gizli → görünür).
* Yeni bir npm paketi ekleme.
* Yetkilendirme matrisini (AGENTS.md §6) değiştirme.

## 🔒 Veri Gizliliği Sınırları

Aşağıdaki alanlar **sadece oturum açmış üyelere** döndürülür:

```
- projeAdi
- avansOrani
- teminatKesintisi
- hakedisPeriyodu
- odemeVadesi
- ilgiliKisi
- ilgiliTelefon
- ilgiliEmail
```

Bu alanları hiçbir zaman public API endpoint'inde veya SSR sayfasında giriş yapmamış kullanıcıya gösterme.

## 📁 Dosya Sistemi Sınırları

* Yalnızca `src/`, `app/`, `components/`, `lib/`, `types/`, `__tests__/` klasörlerini değiştir.
* `prisma/migrations/` dosyalarını asla elle düzenleme.
* `public/` klasörüne kullanıcı yüklediği dosyaları koyma — Supabase Storage kullan.

## 🌐 Dış Servis Sınırları

* Stripe: Sadece `lib/stripe/` modülü üzerinden erişilir.
* Supabase: Sadece `lib/supabase/` modülü üzerinden erişilir.
* E-posta: Sadece `lib/email/` modülü üzerinden gönderilir.
* Dış API çağrıları için her zaman timeout ve hata yönetimi ekle.
