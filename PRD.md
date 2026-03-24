# PRD — İnşaat İhale SaaS Platformu

**Versiyon:** 1.0  
**Tarih:** Mart 2026  
**Durum:** Draft

---

## 1. Vizyon & Amaç

Özel inşaat firmalarının ihale süreçlerini dijital ortamda yönetmesini sağlayan, ihale yayınlama ve teklif verme işlemlerini tek platformda birleştiren B2B SaaS çözümü.

**Misyon:** İnşaat sektöründe iş ortaklarını birleştirmek, ihaleleri şeffaf ve erişilebilir kılmak.  
**Motto:** *"PAYDAŞLARINIZI GENİŞLETİN. PAZARINIZI GENİŞLETİN."*

---

## 2. Hedef Kitle

| Segment | Tanım |
|---|---|
| İhale Sahibi | Proje ihalesi açmak isteyen inşaat firmaları |
| Teklif Veren | İhaleleri takip edip teklif vermek isteyen alt yükleniciler & tedarikçiler |
| Platform Yöneticisi | SaaS operatörü (admin paneli) |

---

## 3. Kullanıcı Hikayeleri (User Stories)

### 3.1 Firma Kaydı
- Firma yöneticisi olarak, resmi firma bilgilerimle (vergi no, ticaret sicil vb.) platforma kayıt olmak istiyorum.
- Kayıt sonrasında e-posta doğrulaması yapabilmek istiyorum.
- **(v2)** Vergi levhası ve risk raporu yükleyerek güvenilirliğimi artırmak istiyorum.

### 3.2 İhale Yayınlama
- İhale sahibi olarak aşağıdaki bilgilerle ihale oluşturmak istiyorum:
  - Proje adı
  - Proje yeri (il/ilçe)
  - İmalat cinsi (Betonarme, Çelik Yapı, Mekanik, Elektrik vb.)
  - Başlangıç ve bitiş tarihi
  - Proje süresi (gün/ay)
  - Avans durumu (var/yok, oran)
  - Teminat kesintisi (%)
  - Ödeme bilgileri (hakediş tipi, vade)
  - İhale son başvuru tarihi
  - İlgili kişi (ad, telefon, e-posta)
  - Açıklama (opsiyonel)

### 3.3 İhale Listeleme
- Ziyaretçi olarak ihalelerin kısıtlı önizlemesini görebilmek istiyorum.
  - Görüntülenebilir alanlar: Proje yeri, imalat cinsi, başlangıç/bitiş tarihi, süre, avans durumu, ihale bitiş tarihi
  - Gizli alanlar: Proje adı, teminat bilgisi, ödeme detayları, ilgili kişi
- Üye olarak tüm ihale detaylarını görebilmek istiyorum.

### 3.4 Teklif Verme
- Üye firma olarak bir ihaleyee teklif verebilmek istiyorum.
- Teklifimin durumunu (beklemede, kabul edildi, reddedildi) takip etmek istiyorum.

---

## 4. Özellik Listesi

### MVP (v1.0)

| # | Özellik | Öncelik |
|---|---|---|
| 1 | Firma kayıt & profil (resmi bilgiler) | P0 |
| 2 | E-posta doğrulama | P0 |
| 3 | İhale oluşturma formu | P0 |
| 4 | İhale listeleme (kısıtlı görünüm) | P0 |
| 5 | Üyelik & auth sistemi | P0 |
| 6 | İhale detay sayfası (üyelere açık) | P0 |
| 7 | Teklif verme formu | P1 |
| 8 | Firma dashboard (yayınladığım ihaleler) | P1 |
| 9 | Teklif yönetimi (gelen teklifleri gör) | P1 |
| 10 | Abonelik / ödeme sistemi (Stripe) | P1 |

### v2.0+

| # | Özellik |
|---|---|
| 11 | Vergi levhası & risk raporu yükleme |
| 12 | Excel entegrasyonu (import/export) |
| 13 | Buluttan proje dosyası yükleme |
| 14 | Teklif kıyaslama tablosu |
| 15 | E-posta / SMS bildirim sistemi |
| 16 | Gelişmiş arama & filtreleme |
| 17 | Firma rating sistemi |

---

## 5. İhale Veri Modeli

```typescript
interface Ihale {
  id: string;
  firmaId: string;

  // Temel Bilgiler
  projeAdi: string;           // Üyelere görünür
  projeYeri: string;          // Herkese görünür
  imalatCinsi: ImalatCinsi;   // Herkese görünür

  // Zaman
  baslangicTarihi: Date;      // Herkese görünür
  bitisTarihi: Date;          // Herkese görünür
  suresi: number;             // Gün cinsinden — Herkese görünür
  ihaleBitisTarihi: Date;     // Herkese görünür

  // Finansal (Sadece üyelere)
  avansDurumu: boolean;       // Herkese görünür (var/yok)
  avansOrani?: number;        // Sadece üyelere
  teminatKesintisi: number;   // Sadece üyelere
  hakedisPeriyodu: string;    // Sadece üyelere
  odemevadesi: number;        // Sadece üyelere

  // İletişim (Sadece üyelere)
  ilgiliKisi: string;
  ilgiliTelefon: string;
  ilgiliEmail: string;

  // Meta
  durum: 'aktif' | 'kapandi' | 'iptal';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. Yetkilendirme Matrisi

| Sayfa / İşlem | Ziyaretçi | Üye | İhale Sahibi | Admin |
|---|---|---|---|---|
| İhale listesi (kısıtlı) | ✅ | ✅ | ✅ | ✅ |
| İhale detayı (tam) | ❌ | ✅ | ✅ | ✅ |
| Teklif ver | ❌ | ✅ | ❌ | ✅ |
| İhale oluştur | ❌ | ✅ | ✅ | ✅ |
| Gelen teklifleri gör | ❌ | ❌ | ✅ | ✅ |
| Firma yönetimi | ❌ | ❌ | ❌ | ✅ |

---

## 7. Başarı Metrikleri (KPIs)

- Kayıtlı firma sayısı (hedef: 100 firma / ilk 3 ay)
- Aktif ihale sayısı (hedef: 50 aktif ihale / ay 3)
- Teklif dönüşüm oranı (ihale başına ortalama teklif > 3)
- Aylık aktif kullanıcı (MAU)
- Churn rate (< %5/ay hedef)
