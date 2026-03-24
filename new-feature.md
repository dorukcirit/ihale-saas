---
description: Yeni bir özellik geliştirmek için standart akış. /new-feature ile tetiklenir.
---

1. Kullanıcıya özelliğin adını ve kısa açıklamasını sor (ör. "Teklif verme formu")

2. PRD.md dosyasını oku ve bu özelliğin hangi user story'ye karşılık geldiğini belirle.

3. Aşağıdaki konularda bir **Implementation Plan Artifact** oluştur:
   - Etkilenecek sayfalar/bileşenler
   - Gerekli API endpoint'leri
   - Veritabanı değişiklikleri (varsa — onay gerektir)
   - Yetkilendirme gereksinimleri (hangi rol erişebilir?)
   - Edge case'ler

4. Kullanıcıdan planı onaylamasını bekle.

5. Onay sonrası sırayla geliştir:
   a. Zod şeması ve TypeScript tipleri (`types/`)
   b. Veritabanı servis katmanı (`lib/db/`)
   c. API endpoint'leri (`app/api/`)
   d. UI bileşenler (`components/`)
   e. Sayfa entegrasyonu (`app/`)

// turbo
6. TypeScript derleme hatalarını kontrol et: `npx tsc --noEmit`

// turbo
7. Testleri çalıştır: `npm run test`

8. Kullanıcıya özet Artifact sun: tamamlanan dosyalar, test sonuçları, kalan TODO'lar.
