/**
 * Zod validasyon şemaları.
 * Tüm formlar ve API girdileri için kullanılır.
 */
import { z } from "zod";

/** Türkiye telefon numarası formatı */
const telefonRegex = /^(\+90|0)?[0-9]{10}$/;

/** Vergi numarası: 10 haneli sayısal */
const vergiNoRegex = /^[0-9]{10}$/;

// ─── Adım 1: Firma Temel Bilgileri ─────────────────────────────────

export const firmaTemelBilgiSemasi = z.object({
  name: z
    .string()
    .min(2, "Firma adı en az 2 karakter olmalı")
    .max(200, "Firma adı en fazla 200 karakter olabilir"),
  tax_number: z
    .string()
    .regex(vergiNoRegex, "Vergi numarası 10 haneli sayısal olmalı"),
  authorized_person: z
    .string()
    .min(2, "Yetkili kişi adı en az 2 karakter olmalı")
    .max(100, "Yetkili kişi adı en fazla 100 karakter olabilir"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z
    .string()
    .regex(telefonRegex, "Geçerli bir Türkiye telefon numarası giriniz"),
});

// ─── Adım 2: Yetkinlikler ──────────────────────────────────────────

export const yetkinlikSemasi = z.object({
  competencies: z
    .array(z.string().uuid())
    .min(1, "En az bir yetkinlik alanı seçmelisiniz"),
});

// ─── Adım 3: Referanslar ───────────────────────────────────────────

export const referansSemasi = z.object({
  employer: z.string().min(2, "İşveren adı gerekli"),
  subject: z.string().min(2, "Konu gerekli"),
  year: z
    .number()
    .int()
    .min(new Date().getFullYear() - 5, "Son 5 yıl içinde olmalı")
    .max(new Date().getFullYear(), "Gelecek tarih girilemez"),
  location: z.string().min(2, "Konum gerekli"),
});

export const referanslarVeMaliSemasi = z.object({
  references: z.array(referansSemasi).optional(),
  balance_sheet: z.string().optional(),
  risk_report: z.string().optional(),
});

// ─── Birleşik Kayıt Şeması ─────────────────────────────────────────

export const kayitFormSemasi = z.object({
  firma: firmaTemelBilgiSemasi,
  competencies: yetkinlikSemasi.shape.competencies,
  references: z.array(referansSemasi).optional(),
  balance_sheet: z.string().optional(),
  risk_report: z.string().optional(),
});

// ─── İhale Oluşturma Şeması ────────────────────────────────────────

export const ihaleOlusturmaSemasi = z.object({
  project_name: z
    .string()
    .min(3, "Proje adı en az 3 karakter olmalı")
    .max(200, "Proje adı en fazla 200 karakter olabilir"),
  project_location: z
    .string()
    .min(2, "Proje yeri gerekli"),
  construction_type: z
    .string()
    .min(2, "İmalat cinsi gerekli"),
  start_date: z.string().min(1, "Başlangıç tarihi gerekli"),
  end_date: z.string().min(1, "Bitiş tarihi gerekli"),
  duration_days: z.number().int().positive("Süre pozitif olmalı"),
  advance_available: z.boolean(),
  advance_rate: z.number().min(0).max(100).optional(),
  guarantee_deduction: z.number().min(0).max(100).optional(),
  progress_payment_period: z.string().optional(),
  payment_term_days: z.number().int().positive().optional(),
  tender_deadline: z.string().min(1, "İhale son başvuru tarihi gerekli"),
  contact_name: z.string().min(2, "İlgili kişi adı gerekli"),
  contact_phone: z
    .string()
    .regex(telefonRegex, "Geçerli bir telefon numarası giriniz"),
  contact_email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  description: z.string().max(2000, "Açıklama en fazla 2000 karakter").optional(),
  visibility: z.enum(["public", "private"]),
  blue_tick_only: z.boolean().default(false),
});

// ─── Tip çıkarımları ────────────────────────────────────────────────

export type FirmaTemelBilgiForm = z.infer<typeof firmaTemelBilgiSemasi>;
export type YetkinlikForm = z.infer<typeof yetkinlikSemasi>;
export type ReferansForm = z.infer<typeof referansSemasi>;
export type KayitForm = z.infer<typeof kayitFormSemasi>;
export type IhaleOlusturmaForm = z.infer<typeof ihaleOlusturmaSemasi>;
