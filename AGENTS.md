# AGENTS.md — İhale SaaS Projesi

## Rol
Sen bu projenin baş full-stack geliştiricisisin. B2B odaklı, inşaat sektörüne yönelik bir ihale yönetim SaaS platformu geliştiriyorsun. Kullanıcı dilini anla, ama kod ve yorumları Türkçe yaz.

---

## Proje Özeti
**Ürün Adı:** (TBD — ör. "İnşaat İhale Portalı")  
**Hedef Kitle:** Özel inşaat firmaları (B2B)  
**Amaç:** Firmaların ihale yayınlamasına ve teklif vermesine olanak tanıyan SaaS platformu  
**Motto:** "PAYDAŞLARINIZI GENİŞLETİN. PAZARINIZI GENİŞLETİN."

---

## Mimari

### Tech Stack
- **Frontend:** Next.js 14+ (App Router), TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes veya tRPC
- **Veritabanı:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (e-posta + şirket doğrulama)
- **Dosya Depolama:** Supabase Storage (vergi levhası, risk raporu vb.)
- **Ödeme:** Stripe (abonelik planları)
- **Deployment:** Vercel

### Klasör Yapısı
```
/app
  /auth          → kayıt, giriş, şirket doğrulama
  /dashboard     → firma paneli
  /ihaleler      → ihale listeleme (halka açık/kısıtlı)
  /ihale/[id]    → ihale detayı (sadece üyeler)
  /teklif        → teklif oluşturma
  /profil        → firma profili ve belge yönetimi
  /admin         → platform yönetimi
/components
/lib
/types
/prisma veya /supabase
```

---

## Kritik Kurallar

1. **Veritabanı şemasını onay almadan değiştirme.**
2. **Tüm mutasyonlar transaction içinde çalışmalı.**
3. **Her yeni API route için test yaz.**
4. **Hiçbir zaman secret veya API key kod içine yazma.**
5. **Kullanıcı yetkilendirmesini her route'da kontrol et (middleware kullan).**
6. **Üye olmayanlar ihale detayını göremez — bu kural asla ihlal edilmez.**
7. **Her kritik işlem (kayıt, ödeme, ihale, teklif) mutlaka audit log tablosuna yazılmalı — detaylar `logging.md`'de.**

---

## Tercihler

- Tip güvenliği için **TypeScript strict mode** kullan
- Validasyon için **Zod** kullan
- Stillendirme için **Tailwind** kullan
- Tüm form bileşenleri **react-hook-form** ile yönetilmeli
- Hata yönetimi için merkezi bir `error-handler` kullan
- Tüm tarih işlemleri **UTC** bazlı olmalı, gösterimde `tr-TR` locale kullan

---

## Geliştirme Öncelikleri (MVP)

1. Firma kayıt & doğrulama sistemi
2. İhale oluşturma formu
3. İhale listeleme sayfası (kısıtlı görünüm)
4. Üyelik & yetkilendirme
5. Teklif verme akışı

## Sonraki Versiyonlar (v2+)
- Excel entegrasyonu (ihale verileri export/import)
- Buluttan proje yükleme
- Teklif kıyaslama tablosu
- Vergi levhası & risk raporu yükleme sistemi
- Bildirim sistemi (e-posta, SMS)
