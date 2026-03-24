---
description: Uygulama genelinde log ve audit kayıt kuralları. Her kritik işlemde uygulanır.
alwaysApply: true
---

# Logging Kuralları

## Temel Prensip

Her kritik işlem **iki katmanda** loglanır:

1. **Audit Log** — Kim, ne zaman, ne yaptı? (veritabanına yazılır, asla silinemez)
2. **Uygulama Logu** — Sistem olayları, hatalar (dosya/servis bazlı)

Kullanıcı verileri **asla** uygulama loguna yazılmaz — sadece ID'ler kullanılır.

---

## Audit Log Tablosu

```sql
CREATE TABLE audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,         -- örn: 'uye.kayit', 'ihale.olusturuldu'
  entity_type   TEXT NOT NULL,         -- örn: 'firma', 'ihale', 'teklif', 'odeme'
  entity_id     UUID NOT NULL,
  firma_id      UUID,                  -- işlemi yapan firma
  kullanici_id  UUID,                  -- işlemi yapan kullanıcı
  onceki_deger  JSONB,                 -- değişiklik öncesi snapshot
  yeni_deger    JSONB,                 -- değişiklik sonrası snapshot
  ip_adresi     TEXT,
  user_agent    TEXT,
  olusturma_ts  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Silme ve güncelleme yasak
-- RLS: Sadece service_role yazabilir, admin okuyabilir
```

> ⚠️ Bu tablo **hiçbir zaman güncellenmez veya silinmez.** Append-only'dir.

---

## Loglanacak Olaylar

### Üyelik & Kimlik

| Olay | event_type |
|---|---|
| Yeni firma kaydı | `uye.kayit` |
| E-posta doğrulama | `uye.dogrulama` |
| Giriş yapıldı | `uye.giris` |
| Çıkış yapıldı | `uye.cikis` |
| Şifre değiştirildi | `uye.sifre_degisim` |
| Şifre sıfırlama talebi | `uye.sifre_sifirlama` |
| Firma profili güncellendi | `firma.guncelleme` |
| Üyelik iptal edildi | `uye.iptal` |

### İhale

| Olay | event_type |
|---|---|
| İhale oluşturuldu | `ihale.olusturuldu` |
| İhale güncellendi | `ihale.guncellendi` |
| İhale yayınlandı | `ihale.yayinlandi` |
| İhale kapatıldı | `ihale.kapatildi` |
| İhale iptal edildi | `ihale.iptal` |
| İhale görüntülendi (üye) | `ihale.goruntulendi` |

### Teklif

| Olay | event_type |
|---|---|
| Teklif oluşturuldu | `teklif.olusturuldu` |
| Teklif güncellendi | `teklif.guncellendi` |
| Teklif geri çekildi | `teklif.geri_cekildi` |
| Teklif kabul edildi | `teklif.kabul` |
| Teklif reddedildi | `teklif.red` |

### Ödeme

| Olay | event_type |
|---|---|
| Abonelik başlatıldı | `odeme.abonelik_basladi` |
| Ödeme alındı | `odeme.basarili` |
| Ödeme başarısız | `odeme.basarisiz` |
| Abonelik yenilendi | `odeme.yenilendi` |
| Abonelik iptal edildi | `odeme.iptal` |
| İade yapıldı | `odeme.iade` |

### Admin

| Olay | event_type |
|---|---|
| Firma onaylandı | `admin.firma_onayi` |
| Firma askıya alındı | `admin.firma_askiya` |
| İhale kaldırıldı | `admin.ihale_kaldirildi` |

---

## Kullanım — Servis Katmanı

Her kritik işlemden sonra mutlaka `auditLog()` çağrılır. Bu çağrı **aynı transaction içinde** yapılır.

```typescript
// lib/audit/index.ts

interface AuditEvent {
  eventType: string;
  entityType: string;
  entityId: string;
  firmaId?: string;
  kullaniciId?: string;
  oncekiDeger?: Record<string, unknown>;
  yeniDeger?: Record<string, unknown>;
  ipAdresi?: string;
  userAgent?: string;
}

export async function auditLog(event: AuditEvent, tx?: Transaction) {
  // tx verilirse mevcut transaction'a katılır
  // verilmezse bağımsız insert yapar
  await (tx ?? db).insert(auditLogTable).values({
    ...event,
    olusturmaTs: new Date(),
  });
}
```

### Doğru Kullanım Örneği

```typescript
// ✅ Transaction içinde logla
await db.transaction(async (tx) => {
  const ihale = await tx.insert(ihaleler).values(data).returning();
  await auditLog({
    eventType: 'ihale.olusturuldu',
    entityType: 'ihale',
    entityId: ihale.id,
    firmaId: session.firmaId,
    kullaniciId: session.userId,
    yeniDeger: ihale,
  }, tx);
});

// ❌ Yanlış — log transaction dışında
const ihale = await db.insert(ihaleler).values(data);
await auditLog({ ... }); // ihale insert başarılı ama log başarısız olabilir
```

---

## Hassas Veri Kuralları

Log kayıtlarına **asla** yazılmayacak alanlar:

```
- Şifre (hash dahil)
- Stripe ödeme kartı bilgisi
- CVV, kart numarası
- Kullanıcının ham şifre sıfırlama tokeni
```

Kişisel veriler loglanırken **maskelenir:**

```typescript
// Telefon: 0532 *** ** 89
// E-posta: ah***@gmail.com
maskele.telefon(tel);
maskele.email(email);
```

---

## Admin Log Görüntüleme

`/admin/loglar` sayfasında:

- Filtreler: tarih aralığı, event_type, firma_id, entity_type
- Varsayılan sıralama: en yeni önce
- Sayfalama: 50 kayıt/sayfa
- Export: CSV (admin yetkisi gerekir)
- Log kayıtları **düzenlenemez ve silinemez** — UI'da bu butonlar bulunmaz

---

## Saklama Süresi

| Log Türü | Süre |
|---|---|
| Audit log (tüm olaylar) | Süresiz (yasal gereklilik) |
| Uygulama hata logları | 90 gün |
| Giriş/erişim logları | 1 yıl |
| Ödeme logları | 10 yıl (vergi mevzuatı) |
