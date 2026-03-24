---
description: Güvenlik gereksinimleri ve kontrol listesi. Auth, veri güvenliği ve dosya yönetimi.
alwaysApply: true
---

# Güvenlik Kuralları

## Kimlik Doğrulama (Auth)

* Oturum doğrulaması her korunan route'da **hem middleware hem de handler** seviyesinde yapılır.
* JWT token'ları client'ta localStorage'da saklanmaz — sadece httpOnly cookie.
* Şifre sıfırlama linkleri maksimum **1 saat** geçerlidir.
* Başarısız giriş denemesi: 5 denemede geçici hesap kilidi (15 dk).
* Firma kaydında e-posta doğrulaması zorunludur; doğrulanmamış firmalar ihale yapamaz.

## Yetkilendirme (Authorization)

* RBAC (Role-Based Access Control) uygulanır. Roller: `visitor`, `member`, `owner`, `admin`.
* İhale detayı serileştirilirken her zaman `serializeIhale(ihale, userRole)` kullanılır:
  ```typescript
  // ✅ Doğru
  return serializeIhale(ihale, session.user.role);

  // ❌ Yanlış
  return ihale; // Ham veri döndürme
  ```
* Firma sahibi yalnızca kendi ihalelerini düzenleyebilir. ID manipülasyonuna karşı kontrol yap.

## Girdi Doğrulama

* Tüm form ve API girdileri Zod ile doğrulanır.
* String alanlar için maksimum uzunluk tanımla (ör. proje adı max 200 karakter).
* Tarih alanlarında geçmiş tarih kontrolü yap (ihale bitiş tarihi bugünden sonra olmalı).
* Telefon numarası Türkiye formatında doğrulanır: `/^(\+90|0)?[0-9]{10}$/`
* Vergi numarası 10 haneli sayısal: `/^[0-9]{10}$/`

## Dosya Yükleme (v2 için hazırlık)

* İzin verilen MIME tipler: `application/pdf`, `image/jpeg`, `image/png`
* Maksimum dosya boyutu: **5MB**
* Dosya isimleri sunucu tarafında UUID ile yeniden adlandırılır.
* Yüklenen dosyalar Supabase Storage'da private bucket'ta tutulur — public URL oluşturma.
* Dosyaya erişim için imzalı URL (signed URL) kullan, süre max 1 saat.

## API Güvenliği

* Rate limiting: `/api/auth/*` endpoint'leri için IP başına dakikada 10 istek.
* CORS ayarları production'da sadece kendi domain'ini kabul edecek şekilde ayarlanır.
* Tüm API response'larında hassas hata mesajları gizlenir (stack trace production'da gösterilmez).
* Webhook'lar (Stripe vb.) imza doğrulaması ile korunur.

## Ortam Değişkenleri

```
# Zorunlu — .env.local'de tanımlanmalı
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Sadece server-side
STRIPE_SECRET_KEY=               # Sadece server-side
STRIPE_WEBHOOK_SECRET=
NEXTAUTH_SECRET=
```

* `SUPABASE_SERVICE_ROLE_KEY` ve `STRIPE_SECRET_KEY` asla client'a expose edilmez (`NEXT_PUBLIC_` prefix kullanılmaz).
* Production secret'ları sadece Vercel Environment Variables'ta saklanır.

## Güvenlik Kontrol Listesi (Her Release Öncesi)

- [ ] Tüm yeni endpoint'lerde auth kontrolü var mı?
- [ ] Hassas alanlar public API'den filtrelendi mi?
- [ ] Yeni form validasyonları Zod ile tanımlı mı?
- [ ] Environment variable'lar production'da set edildi mi?
- [ ] Rate limiting aktif mi?
- [ ] CORS ayarları production domain'i kısıtlıyor mu?
