/**
 * Ana TypeScript tip tanımları.
 * Tüm veritabanı tablolarına karşılık gelen interface'ler.
 */

/** Firma abonelik durumu */
export type AbonelikDurumu = "active" | "past_due" | "canceled" | "trialing";

/** İhale durumu */
export type IhaleDurumu = "active" | "draft" | "completed" | "cancelled";

/** İhale görünürlüğü */
export type IhaleGorunurlugu = "public" | "private";

/** Bildirim tipi */
export type BildirimTipi = "date_change" | "content_change" | "deadline";

/** Kullanıcı rolleri */
export type KullaniciRolu = "visitor" | "member" | "owner" | "admin";

/** Doğrulama seviyesi */
export type DogrulamaSeviyesi = 1 | 2 | 3;

/** Firma tablosu */
export interface Firma {
  id: string;
  name: string;
  tax_number: string;
  authorized_person: string;
  email: string;
  phone: string;
  logo_url: string | null;
  tax_doc_url: string | null;
  verification_level: DogrulamaSeviyesi;
  has_blue_tick: boolean;
  stripe_customer_id?: string;
  subscription_status?: AbonelikDurumu;
  created_at: string;
  updated_at: string;
}

/** Kategori tablosu (yetkinlik ağacı) */
export interface Kategori {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  sort_order: number;
}

/** Kategori ağacı (UI için — çocuklar dahil) */
export interface KategoriAgaci extends Kategori {
  children: KategoriAgaci[];
}

/** Firma yetkinliği (junction) */
export interface FirmaYetkinlik {
  firm_id: string;
  category_id: string;
}

/** İhale tablosu (tam veri — sadece yetkili kullanıcılar) */
export interface Ihale {
  id: string;
  firm_id: string;
  project_name: string;
  project_location: string;
  construction_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  advance_available: boolean;
  advance_rate: number | null;
  guarantee_deduction: number | null;
  progress_payment_period: string | null;
  payment_term_days: number | null;
  tender_deadline: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  description: string | null;
  status: IhaleDurumu;
  visibility: IhaleGorunurlugu;
  created_at: string;
  updated_at: string;
  /** İlişkili firma bilgisi (join ile) */
  firma?: Firma;
}

/** Maskelenmiş ihale (ziyaretçiler ve ücretsiz kullanıcılar için) */
export interface MaskelenmisIhale {
  id: string;
  masked_firm_name: string;
  masked_project_name: string;
  project_location: string;
  construction_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  advance_available: boolean;
  tender_deadline: string;
  status: IhaleDurumu;
}

/** Takip listesi */
export interface TakipListesi {
  id: string;
  firm_id: string;
  tender_id: string;
  created_at: string;
  /** İlişkili ihale (join ile) */
  ihale?: Ihale;
}

/** Bildirim */
export interface Bildirim {
  id: string;
  tender_id: string;
  firm_id: string;
  type: BildirimTipi;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** Referans (kayıt formu adım 3) */
export interface Referans {
  employer: string;
  subject: string;
  year: number;
  location: string;
}

/** Kayıt formu — tüm adımların birleşik tipi */
export interface KayitFormVerisi {
  /** Adım 1: Firma bilgileri */
  firma: {
    name: string;
    tax_number: string;
    authorized_person: string;
    email: string;
    phone: string;
    logo?: File;
    tax_document?: File;
  };
  /** Adım 2: Yetkinlikler */
  competencies: string[];
  /** Adım 3: Referanslar */
  references: Referans[];
  balance_sheet: string;
  risk_report: string;
}
