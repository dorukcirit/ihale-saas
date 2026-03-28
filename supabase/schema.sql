-- ============================================================
-- İhale SaaS — Supabase Veritabanı Şeması
-- ============================================================
-- Bu dosya Supabase SQL Editor'de çalıştırılmalıdır.
-- Tüm tablolar, view'lar ve RLS politikalarını içerir.
-- ============================================================

-- UUID eklentisi (genellikle Supabase'de zaten aktif)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. FIRMS (Firmalar) ──────────────────────────────────────────

CREATE TABLE firms (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  tax_number          TEXT NOT NULL UNIQUE CHECK (tax_number ~ '^[0-9]{10}$'),
  address             TEXT NOT NULL,
  website             TEXT,
  authorized_person   TEXT NOT NULL,
  email               TEXT NOT NULL,
  show_email          BOOLEAN NOT NULL DEFAULT false,
  phone               TEXT NOT NULL,
  show_phone          BOOLEAN NOT NULL DEFAULT false,
  logo_url            TEXT,
  tax_doc_url         TEXT,
  risk_report_url     TEXT,
  risk_report_shared  BOOLEAN NOT NULL DEFAULT false,
  balance_sheet_url   TEXT,
  balance_sheet_shared BOOLEAN NOT NULL DEFAULT false,
  subscription_status TEXT NOT NULL DEFAULT 'free'
                      CHECK (subscription_status IN ('free', 'active', 'suspended')),
  membership_type     INT NOT NULL DEFAULT 1 CHECK (membership_type IN (1, 2, 3)), -- 1: Temel, 2: Uzman, 3: Çözüm Ortağı
  has_blue_tick       BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. CATEGORIES (Yetkinlik Kategori Ağacı) ────────────────────

CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  parent_id  UUID REFERENCES categories(id) ON DELETE CASCADE,
  level      INT NOT NULL DEFAULT 1 CHECK (level IN (1, 2)),
  sort_order INT NOT NULL DEFAULT 0
);

-- ─── 3. FIRM_COMPETENCIES (Firma-Kategori Junction) ──────────────

CREATE TABLE firm_competencies (
  firm_id     UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (firm_id, category_id)
);

-- ─── 4. FIRM_REFERENCES (Firma Referansları) ─────────────────────

CREATE TABLE firm_references (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id          UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  employer         TEXT NOT NULL,
  project_name     TEXT NOT NULL,
  project_location TEXT NOT NULL,
  project_date     DATE NOT NULL,
  scope            TEXT NOT NULL,
  category_id      UUID NOT NULL REFERENCES categories(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 5. TENDERS (İhaleler) ────────────────────────────────────────

CREATE TABLE tenders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id                  UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  project_name             TEXT NOT NULL,
  project_location         TEXT NOT NULL,
  subject                  TEXT NOT NULL,
  category_id              UUID NOT NULL REFERENCES categories(id),
  description              TEXT,
  advance_available        BOOLEAN NOT NULL DEFAULT false,
  advance_rate             NUMERIC(5,2),
  duration_days            INT NOT NULL CHECK (duration_days > 0),
  start_date               DATE NOT NULL,
  tender_start_date        DATE NOT NULL,
  tender_deadline          TIMESTAMPTZ NOT NULL,
  allowed_levels           INT[] NOT NULL DEFAULT '{2,3}', -- Hangi üyelik tipleri görebilir
  target_cities            TEXT[], -- Şehir kısıtlaması yoksa boş array
  barter_available         BOOLEAN NOT NULL DEFAULT false,
  contact_phone            TEXT NOT NULL,
  contact_email            TEXT NOT NULL,
  external_link            TEXT,
  status                   TEXT NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('active', 'draft', 'completed', 'cancelled')),
  visibility               TEXT NOT NULL DEFAULT 'public'
                           CHECK (visibility IN ('public', 'private')),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sadece belirli firmaların davet edildiği ihaleler için
CREATE TABLE tender_invited_firms (
  tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  firm_id   UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  PRIMARY KEY (tender_id, firm_id)
);

-- ─── 6. WATCHLIST (Takip Listesi) ─────────────────────────────────

CREATE TABLE watchlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id    UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  tender_id  UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (firm_id, tender_id)
);

-- ─── 7. TENDER_NOTIFICATIONS (Bildirimler) ───────────────────────

CREATE TABLE tender_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id  UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  firm_id    UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('date_change', 'content_change', 'deadline')),
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 8. AUDIT_LOG (Denetim Kaydı — Append Only) ──────────────────

CREATE TABLE audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  entity_type   TEXT NOT NULL,
  entity_id     UUID NOT NULL,
  firma_id      UUID,
  kullanici_id  UUID,
  onceki_deger  JSONB,
  yeni_deger    JSONB,
  ip_adresi     TEXT,
  user_agent    TEXT,
  olusturma_ts  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 9. ROW LEVEL SECURITY (RLS) ─────────────────────────────────

-- firms tablosu
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Firmalar kendi profillerini görebilir" ON firms
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Firmalar kendi profillerini güncelleyebilir" ON firms
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Yeni firma kaydı" ON firms
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Başka profilleri görme kuralları: Çözüm Ortağı (3) herkesi görebilir, Uzman (2) kendi ihalesiyle etkileşenleri görebilir. vs.

-- firm_references tablosu
ALTER TABLE firm_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes referansları görebilir" ON firm_references FOR SELECT USING (true);
CREATE POLICY "Firma kendi referanslarını yönetebilir" ON firm_references 
  FOR ALL USING (firm_id IN (SELECT id FROM firms WHERE auth_user_id = auth.uid()));

-- tenders tablosu
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İhaleleri görebilme kuralı" ON tenders FOR SELECT USING (true);
CREATE POLICY "Firma kendi ihalelerini yönetir" ON tenders
  FOR ALL USING (firm_id IN (SELECT id FROM firms WHERE auth_user_id = auth.uid()));

-- ─── 10. SEED DATA: Revize Edilmiş Kategori Ağacı ──────────────────────────────

-- Ana Kategoriler
INSERT INTO categories (id, name, parent_id, level, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Zemin ve Altyapı Taşeronları (Ağır İşler)', NULL, 1, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Kaba Yapı Taşeronları', NULL, 1, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Dış Cephe ve Çatı Taşeronları (Kabuk)', NULL, 1, 3),
  ('a1000000-0000-0000-0000-000000000004', 'İnce İnşaat ve Dekorasyon Taşeronları (İç Mekan)', NULL, 1, 4),
  ('a1000000-0000-0000-0000-000000000005', 'Mekanik, Elektrik ve Asansör (MEP)', NULL, 1, 5),
  ('a1000000-0000-0000-0000-000000000006', 'Peyzaj ve Çevre Düzenleme Taşeronları', NULL, 1, 6),
  ('a1000000-0000-0000-0000-000000000007', 'Tamamlayıcı ve Yardımcı Taşeronlar', NULL, 1, 7);

-- Alt Kategoriler: 1. Zemin ve Altyapı
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Hafriyat Taşeronu', 'a1000000-0000-0000-0000-000000000001', 2, 1),
  ('Geoteknik (Zemin İyileştirme) Taşeronu', 'a1000000-0000-0000-0000-000000000001', 2, 2),
  ('Altyapı (Mekanik Altyapı) Taşeronu', 'a1000000-0000-0000-0000-000000000001', 2, 3),
  ('Yıkım Taşeronu', 'a1000000-0000-0000-0000-000000000001', 2, 4);

-- Alt Kategoriler: 2. Kaba Yapı
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Kaba İnşaat (Kalıp-Demir-Beton) Taşeronu', 'a1000000-0000-0000-0000-000000000002', 2, 1),
  ('Çelik Konstrüksiyon Taşeronu', 'a1000000-0000-0000-0000-000000000002', 2, 2),
  ('Endüstriyel Zemin Taşeronu', 'a1000000-0000-0000-0000-000000000002', 2, 3),
  ('Prefabrik/Prekast Montaj Taşeronu', 'a1000000-0000-0000-0000-000000000002', 2, 4);

-- Alt Kategoriler: 3. Dış Cephe ve Çatı
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Alüminyum ve Cam Cephe Taşeronu', 'a1000000-0000-0000-0000-000000000003', 2, 1),
  ('Mekanik Cephe Taşeronu', 'a1000000-0000-0000-0000-000000000003', 2, 2),
  ('Yalıtım ve Mantolama Taşeronu', 'a1000000-0000-0000-0000-000000000003', 2, 3),
  ('Çatı ve Kenet Sistem Taşeronu', 'a1000000-0000-0000-0000-000000000003', 2, 4),
  ('İzolasyon Uzmanı (Spesifik)', 'a1000000-0000-0000-0000-000000000003', 2, 5);

-- Alt Kategoriler: 4. İnce İnşaat ve Dekorasyon
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Duvar ve Kaba Sıva Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 1),
  ('Alçıpan ve Asma Tavan Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 2),
  ('Zemin Kaplama ve Seramik Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 3),
  ('İç Mekan Cam ve Ayna İşleri Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 4),
  ('Mobilya ve Doğrama Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 5),
  ('Boya ve Duvar Kağıdı Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 6),
  ('Metal Dekorasyon (Ferforje) Taşeronu', 'a1000000-0000-0000-0000-000000000004', 2, 7);

-- Alt Kategoriler: 5. Mekanik, Elektrik ve Asansör
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Mekanik Tesisat Taşeronu', 'a1000000-0000-0000-0000-000000000005', 2, 1),
  ('Elektrik ve Zayıf Akım Taşeronu', 'a1000000-0000-0000-0000-000000000005', 2, 2),
  ('Asansör ve Yürüyen Merdiven Taşeronu', 'a1000000-0000-0000-0000-000000000005', 2, 3),
  ('Otomasyon Taşeronu', 'a1000000-0000-0000-0000-000000000005', 2, 4);

-- Alt Kategoriler: 6. Peyzaj ve Çevre Düzenleme
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Sert Peyzaj Taşeronu', 'a1000000-0000-0000-0000-000000000006', 2, 1),
  ('Bitkisel Peyzaj Taşeronu', 'a1000000-0000-0000-0000-000000000006', 2, 2),
  ('Havuz ve Islak Alan Taşeronu', 'a1000000-0000-0000-0000-000000000006', 2, 3),
  ('Çevre Güvenlik ve Çit Taşeronu', 'a1000000-0000-0000-0000-000000000006', 2, 4);

-- Alt Kategoriler: 7. Tamamlayıcı ve Yardımcı
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Endüstriyel Kapı ve Yangın Kapısı Taşeronu', 'a1000000-0000-0000-0000-000000000007', 2, 1),
  ('Reklam, Yönlendirme ve Tabela Taşeronu', 'a1000000-0000-0000-0000-000000000007', 2, 2),
  ('Temizlik Taşeronu', 'a1000000-0000-0000-0000-000000000007', 2, 3),
  ('Yol Çizgi ve Trafik Levhası Taşeronu', 'a1000000-0000-0000-0000-000000000007', 2, 4);
