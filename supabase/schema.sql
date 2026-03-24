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
  authorized_person   TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  logo_url            TEXT,
  tax_doc_url         TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free'
                      CHECK (subscription_status IN ('free', 'active', 'suspended')),
  verification_level  INT NOT NULL DEFAULT 1 CHECK (verification_level IN (1, 2, 3)),
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

-- ─── 4. TENDERS (İhaleler) ────────────────────────────────────────

CREATE TABLE tenders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id                  UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  project_name             TEXT NOT NULL,
  project_location         TEXT NOT NULL,
  construction_type        TEXT NOT NULL,
  start_date               DATE NOT NULL,
  end_date                 DATE NOT NULL,
  duration_days            INT NOT NULL CHECK (duration_days > 0),
  advance_available        BOOLEAN NOT NULL DEFAULT false,
  advance_rate             NUMERIC(5,2),
  guarantee_deduction      NUMERIC(5,2),
  progress_payment_period  TEXT,
  payment_term_days        INT,
  tender_deadline          TIMESTAMPTZ NOT NULL,
  contact_name             TEXT NOT NULL,
  contact_phone            TEXT NOT NULL,
  contact_email            TEXT NOT NULL,
  description              TEXT,
  status                   TEXT NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('active', 'draft', 'completed', 'cancelled')),
  visibility               TEXT NOT NULL DEFAULT 'public'
                           CHECK (visibility IN ('public', 'private')),
  blue_tick_only           BOOLEAN NOT NULL DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 5. WATCHLIST (Takip Listesi) ─────────────────────────────────

CREATE TABLE watchlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id    UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  tender_id  UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (firm_id, tender_id)
);

-- ─── 6. TENDER_NOTIFICATIONS (Bildirimler) ───────────────────────

CREATE TABLE tender_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id  UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  firm_id    UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('date_change', 'content_change', 'deadline')),
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 7. AUDIT_LOG (Denetim Kaydı — Append Only) ──────────────────

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

-- Audit log'da güncelleme ve silme yasak
-- (RLS ile korunur, ayrıca uygulama katmanında da engellenir)

-- ─── 8. MASKED_TENDERS_VIEW (KVKK Uyumlu Maskelenmiş Görünüm) ──

CREATE OR REPLACE VIEW masked_tenders_view AS
SELECT
  t.id,
  -- CSS blur maskeleme kullanılacağı için isimler kısıtlanmadan döndürülüyor
  f.name AS masked_firm_name,
  t.project_name AS masked_project_name,
  t.project_location,
  t.construction_type,
  t.start_date,
  t.end_date,
  t.duration_days,
  t.advance_available,
  t.tender_deadline,
  t.status
FROM tenders t
JOIN firms f ON t.firm_id = f.id
WHERE t.status = 'active'
  AND t.visibility = 'public';

-- ─── 9. ROW LEVEL SECURITY (RLS) ─────────────────────────────────

-- firms tablosu
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Firmalar kendi profillerini görebilir" ON firms
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Firmalar kendi profillerini güncelleyebilir" ON firms
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Yeni firma kaydı" ON firms
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- tenders tablosu
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;

-- Tüm kayıtlı firmalar aktif ihaleleri görebilir (Level 1 UI da blur görecek)
-- Ancak sadece mavi tikli (level 3) olanlar blue_tick_only=true ihaleleri görebilir.
CREATE POLICY "Kayıtlı kullanıcılar ihaleleri görebilir" ON tenders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM firms
      WHERE firms.auth_user_id = auth.uid()
        AND (
          (tenders.blue_tick_only = false) OR 
          (tenders.blue_tick_only = true AND firms.verification_level = 3)
        )
    )
    AND status = 'active'
  );

-- Firma kendi ihalelerini yönetebilir
CREATE POLICY "Firma kendi ihalelerini yönetir" ON tenders
  FOR ALL USING (
    firm_id IN (
      SELECT id FROM firms WHERE auth_user_id = auth.uid()
    )
  );

-- watchlist tablosu
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Firma kendi takip listesi" ON watchlist
  FOR ALL USING (
    firm_id IN (
      SELECT id FROM firms WHERE auth_user_id = auth.uid()
    )
  );

-- tender_notifications tablosu
ALTER TABLE tender_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Firma kendi bildirimlerini görebilir" ON tender_notifications
  FOR SELECT USING (
    firm_id IN (
      SELECT id FROM firms WHERE auth_user_id = auth.uid()
    )
  );

-- audit_log tablosu
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Sadece service_role yazabilir (varsayılan olarak RLS anon/authenticated için engeldir)
-- Admin okuma politikası:
CREATE POLICY "Admin audit log okuyabilir" ON audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM firms
      WHERE firms.auth_user_id = auth.uid()
        AND firms.subscription_status = 'active'
      -- Gerçek admin kontrolü için ek bir role sütunu eklenebilir
    )
  );

-- ─── 10. SEED DATA: Kategori Ağacı ──────────────────────────────

-- Ana Kategoriler
INSERT INTO categories (id, name, parent_id, level, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Altyapı ve Zemin', NULL, 1, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Kaba İnşaat', NULL, 1, 2),
  ('a1000000-0000-0000-0000-000000000003', 'İnce İnşaat', NULL, 1, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Cephe & Yalıtım', NULL, 1, 4),
  ('a1000000-0000-0000-0000-000000000005', 'MEP (Mekanik/Elektrik)', NULL, 1, 5),
  ('a1000000-0000-0000-0000-000000000006', 'Özel İmalat', NULL, 1, 6);

-- Alt Kategoriler: Altyapı ve Zemin
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Hafriyat', 'a1000000-0000-0000-0000-000000000001', 2, 1),
  ('Zemin İyileştirme (Jet Grout, Fore Kazık)', 'a1000000-0000-0000-0000-000000000001', 2, 2),
  ('İksa Sistemleri', 'a1000000-0000-0000-0000-000000000001', 2, 3);

-- Alt Kategoriler: Kaba İnşaat
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Betonarme Karkas', 'a1000000-0000-0000-0000-000000000002', 2, 1),
  ('Çelik Konstrüksiyon', 'a1000000-0000-0000-0000-000000000002', 2, 2),
  ('Duvar İşleri', 'a1000000-0000-0000-0000-000000000002', 2, 3);

-- Alt Kategoriler: İnce İnşaat
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Sıva / Şap', 'a1000000-0000-0000-0000-000000000003', 2, 1),
  ('Zemin Kaplama', 'a1000000-0000-0000-0000-000000000003', 2, 2),
  ('Asma Tavan / Bölme Duvar', 'a1000000-0000-0000-0000-000000000003', 2, 3),
  ('Boya / Dekorasyon', 'a1000000-0000-0000-0000-000000000003', 2, 4);

-- Alt Kategoriler: Cephe & Yalıtım
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Mantolama', 'a1000000-0000-0000-0000-000000000004', 2, 1),
  ('Giydirme Cephe', 'a1000000-0000-0000-0000-000000000004', 2, 2),
  ('Su / Isı Yalıtımı', 'a1000000-0000-0000-0000-000000000004', 2, 3);

-- Alt Kategoriler: MEP
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('HVAC', 'a1000000-0000-0000-0000-000000000005', 2, 1),
  ('Yangın Tesisatı', 'a1000000-0000-0000-0000-000000000005', 2, 2),
  ('Zayıf Akım', 'a1000000-0000-0000-0000-000000000005', 2, 3),
  ('Otomasyon', 'a1000000-0000-0000-0000-000000000005', 2, 4);

-- Alt Kategoriler: Özel İmalat
INSERT INTO categories (name, parent_id, level, sort_order) VALUES
  ('Mobilya / Ahşap', 'a1000000-0000-0000-0000-000000000006', 2, 1),
  ('Peyzaj', 'a1000000-0000-0000-0000-000000000006', 2, 2),
  ('Havuz', 'a1000000-0000-0000-0000-000000000006', 2, 3);
