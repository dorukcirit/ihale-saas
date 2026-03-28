-- =========================================================================
-- İHALE SaaS - TEST KULLANICILARI VE FİRMALARI (Üye, Uzman, Çözüm Ortağı)
-- =========================================================================
-- DİKKAT: Bu script, yerel veya test (staging) veritabanınızda Supabase'in 
-- SQL Editor ekranından çalıştırılmak üzere yazılmıştır. Gerçek üyelikler 
-- sisteme eklendiği için Auth Login tarafında doğrudan bu hesaplarla giriş yapabilirsiniz.
-- Güvenlik sebebiyle canlı (Production) sunucuda çalıştırmayınız.
--
-- Şifrelerin Tümü: Test1234!
-- =========================================================================

-- UUID uzantısı (Eğer aktif değilse diye)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. TEMEL ÜYE EKLEME (membership_type = 1)
-- ==========================================

DO $$
DECLARE 
  uid UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- 1) auth.users'a e-posta ile kayıtlı kullanıcıyı oluştur
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data)
  VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'temel@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"name": "Ahmet Temel"}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2) auth.identities'a email identity'sini ekle (Login olabilmek için şarttır)
  INSERT INTO auth.identities (id, user_id, provider, identity_data, created_at, updated_at)
  VALUES (
    gen_random_uuid(), uid, 'email',
    format('{"sub":"%s","email":"%s"}', uid::text, 'temel@test.com')::jsonb,
    now(), now()
  ) ON CONFLICT DO NOTHING;

  -- 3) public.firms tablosuna "Temel" seviyesinde firma profilini ekle (membership_type = 1)
  INSERT INTO public.firms (auth_user_id, name, tax_number, address, authorized_person, email, phone, membership_type, subscription_status)
  VALUES (
    uid,
    'Temel Yapı A.Ş. (Ücretsiz Üye)',
    '1111111111',
    'Mustafa Kemal Bulvarı No:111, Ankara',
    'Ahmet Temel',
    'temel@test.com',
    '05551111111',
    1, -- 1: Temel
    'free'
  ) ON CONFLICT DO NOTHING;
END $$;


-- ==========================================
-- 2. UZMAN ÜYE EKLEME (membership_type = 2)
-- ==========================================

DO $$
DECLARE 
  uid UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data)
  VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'uzman@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"name": "Mehmet Uzman"}'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, provider, identity_data, created_at, updated_at)
  VALUES (
    gen_random_uuid(), uid, 'email',
    format('{"sub":"%s","email":"%s"}', uid::text, 'uzman@test.com')::jsonb,
    now(), now()
  ) ON CONFLICT DO NOTHING;

  INSERT INTO public.firms (auth_user_id, name, tax_number, address, authorized_person, email, phone, membership_type, subscription_status)
  VALUES (
    uid,
    'Uzman Mühendislik Ltd. (Orta Seviye)',
    '2222222222',
    'Ataşehir Barbaros Mah. No:222, İstanbul',
    'Mehmet Uzman',
    'uzman@test.com',
    '05552222222',
    2, -- 2: Uzman
    'active'
  ) ON CONFLICT DO NOTHING;
END $$;


-- ================================================
-- 3. ÇÖZÜM ORTAĞI ÜYE EKLEME (membership_type = 3)
-- ================================================

DO $$
DECLARE 
  uid UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_user_meta_data)
  VALUES (
    uid,
    '00000000-0000-0000-0000-000000000000',
    'cozum@test.com',
    crypt('Test1234!', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"name": "Ali Çözüm"}'
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, provider, identity_data, created_at, updated_at)
  VALUES (
    gen_random_uuid(), uid, 'email',
    format('{"sub":"%s","email":"%s"}', uid::text, 'cozum@test.com')::jsonb,
    now(), now()
  ) ON CONFLICT DO NOTHING;

  INSERT INTO public.firms (auth_user_id, name, tax_number, address, authorized_person, email, phone, membership_type, subscription_status, has_blue_tick)
  VALUES (
    uid,
    'Çözüm Global İnşaat Holding (Premium)',
    '3333333333',
    'Levent Büyükdere Cad. No:333, İstanbul',
    'Ali Çözüm',
    'cozum@test.com',
    '05553333333',
    3, -- 3: Çözüm Ortağı
    'active',
    true -- Ekstra olarak Mavi Tik verelim, tam yetkili görünsün
  ) ON CONFLICT DO NOTHING;
END $$;
