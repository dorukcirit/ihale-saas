/**
 * Ana TypeScript tip tanımları.
 * Tüm veritabanı tablolarına karşılık gelen interface'ler.
 */

/** Doğrulama seviyesi: 1 = Kayıtlı, 2 = Üye, 3 = Mavi Tikli */
export type DogrulamaSeviyesi = 1 | 2 | 3;

/** Firma abonelik durumu */
export type AbonelikDurumu = "active" | "suspended" | "free";

/** Üyelik Tipi (Seviyesi) */
export type UyelikTipi = 1 | 2 | 3; // 1: Temel, 2: Uzman, 3: Çözüm Ortağı

/** İhale durumu */
export type IhaleDurumu = "active" | "draft" | "completed" | "cancelled";

/** İhale görünürlüğü */
export type IhaleGorunurlugu = "public" | "private";

/** Bildirim tipi */
export type BildirimTipi = "date_change" | "content_change" | "deadline";

/** Kullanıcı rolleri */
export type KullaniciRolu = "visitor" | "member" | "owner" | "admin";

/** Firma tablosu */
export interface Firma {
  id: string;
  auth_user_id: string;
  name: string;
  tax_number: string;
  address: string;
  website: string | null;
  authorized_person: string;
  email: string;
  show_email: boolean;
  phone: string;
  show_phone: boolean;
  logo_url: string | null;
  tax_doc_url: string | null;
  risk_report_url: string | null;
  risk_report_shared: boolean;
  balance_sheet_url: string | null;
  balance_sheet_shared: boolean;
  membership_type: UyelikTipi;
  has_blue_tick: boolean;
  subscription_status: AbonelikDurumu;
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

/** Firma Referans Tablosu */
export interface FirmaReferans {
  id: string;
  firm_id: string;
  employer: string;
  project_name: string;
  project_location: string;
  project_date: string;
  scope: string;
  category_id: string;
  created_at: string;
}

/** İhale tablosu (tam veri) */
export interface Ihale {
  id: string;
  firm_id: string;
  project_name: string;
  project_location: string;
  subject: string;
  category_id: string;
  description: string | null;
  advance_available: boolean;
  advance_rate: number | null;
  duration_days: number;
  start_date: string;
  tender_start_date: string;
  tender_deadline: string;
  allowed_levels: number[];
  target_cities: string[];
  barter_available: boolean;
  contact_phone: string;
  contact_email: string;
  external_link: string | null;
  status: IhaleDurumu;
  visibility: IhaleGorunurlugu;
  created_at: string;
  updated_at: string;
  /** İlişkili firma bilgisi (join ile) */
  firma?: Firma;
}

/** Maskelenmiş ihale (ziyaretçiler, Temel seviye vs.) */
export interface MaskelenmisIhale {
  id: string;
  masked_firm_name: string;
  masked_project_name: string;
  project_location: string;
  subject: string;
  start_date: string;
  tender_deadline: string;
  duration_days: number;
  advance_available: boolean;
  status: IhaleDurumu;
}

/** İhaleye davet edilen firmalar junction */
export interface IhaleDavetliFirma {
  tender_id: string;
  firm_id: string;
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

/** Referans (kayıt formu adım 3 için kullanılan tip) */
export interface FormReferans {
  employer: string;
  project_name: string;
  project_location: string;
  project_date: string;
  scope: string;
  category_id: string;
}

/** Kayıt formu — tüm adımların birleşik tipi */
export interface KayitFormVerisi {
  firma: {
    name: string;
    tax_number: string;
    address: string;
    website?: string;
    authorized_person: string;
    email: string;
    show_email: boolean;
    phone: string;
    show_phone: boolean;
    logo?: File;
    tax_document?: File;
  };
  competencies: string[];
  references: FormReferans[];
  balance_sheet?: File | string;
  balance_sheet_shared: boolean;
  risk_report?: File | string;
  risk_report_shared: boolean;
}
