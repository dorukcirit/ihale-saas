---
description: Production deploy öncesi kontrol ve deploy akışı. /deploy ile tetiklenir.
---

1. Kullanıcıya hangi branch'in deploy edileceğini sor.

// turbo
2. TypeScript derlemesini kontrol et: `npx tsc --noEmit`

// turbo
3. Tüm testleri çalıştır: `npm run test`

// turbo
4. Lint kontrolü yap: `npm run lint`

5. Güvenlik kontrol listesini (security.md) gözden geçir ve kullanıcıya sun. Her madde için onay al.

6. Environment variable'ların production'da set edilip edilmediğini kullanıcıya sor.

7. Kullanıcıdan son onay al: "Tüm kontroller tamam, deploy edilsin mi?"

// turbo
8. Vercel'e deploy et: `npx vercel --prod`

9. Deploy sonrası özet Artifact sun: deploy URL, süre, varsa hata logları.
