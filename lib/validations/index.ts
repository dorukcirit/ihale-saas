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

export const firmaTemelBilgiSemasi = z
  .object({
    name: z
      .string()
      .min(2, "Firma adı en az 2 karakter olmalı")
      .max(200, "Firma adı en fazla 200 karakter olabilir"),
    tax_number: z
      .string()
      .regex(vergiNoRegex, "Vergi numarası 10 haneli sayısal olmalı"),
    address: z.string().min(10, "Açık adres giriniz"),
    website: z.string().url("Geçerli bir web adresi giriniz").optional().or(z.literal("")),
    authorized_person: z
      .string()
      .min(2, "Yetkili kişi adı en az 2 karakter olmalı")
      .max(100, "Yetkili kişi adı en fazla 100 karakter olabilir"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    show_email: z.boolean().default(false),
    /** Kayıt cep telefonu (sistemde iletişim numarası olarak kullanılacak) */
    kayit_telefonu: z
      .string()
      .regex(telefonRegex, "Geçerli bir Türkiye cep numarası giriniz"),
    show_phone: z.boolean().default(false),
    /** Şirket telefonu (herkese açık numara) */
    sirket_telefonu: z
      .string()
      .regex(telefonRegex, "Geçerli bir Türkiye telefon numarası giriniz")
      .optional()
      .or(z.literal("")),
    /** Şirket telefonunun profilde görünürlüğü */
    telefon_gorünur: z.boolean().default(false),
    sifre: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .max(100, "Şifre en fazla 100 karakter olabilir"),
    sifre_tekrar: z.string(),
  })
  .refine((v) => v.sifre === v.sifre_tekrar, {
    message: "Şifreler eşleşmiyor",
    path: ["sifre_tekrar"],
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
  project_name: z.string().min(2, "Proje adı gerekli"),
  project_location: z.string().min(2, "Proje yeri/şehri gerekli"),
  project_date: z.string().min(1, "Proje tarihi gerekli"),
  scope: z.string().min(5, "İşin kapsamı gerekli"),
  category_id: z.string().uuid("Geçerli bir kategori seçiniz"),
});

// Referans array en az 5 olmalı şartı
export const referansDizisiSemasi = z
  .array(referansSemasi)
  .min(5, "Son 5 yılda tamamlanmış en az 5 referans girmelisiniz.");

export const referanslarVeMaliSemasi = z.object({
  references: referansDizisiSemasi,
  balance_sheet: z.string().optional(),
  balance_sheet_shared: z.boolean().default(false),
  risk_report: z.string().optional(),
  risk_report_shared: z.boolean().default(false),
});

// ─── Birleşik Kayıt Şeması ─────────────────────────────────────────

export const kayitFormSemasi = z.object({
  firma: firmaTemelBilgiSemasi,
  competencies: yetkinlikSemasi.shape.competencies,
  references: referansDizisiSemasi,
  balance_sheet: z.string().optional(),
  balance_sheet_shared: z.boolean().default(false),
  risk_report: z.string().optional(),
  risk_report_shared: z.boolean().default(false),
});

// ─── Tip çıkarımları ────────────────────────────────────────────────

export type FirmaTemelBilgiForm = z.infer<typeof firmaTemelBilgiSemasi>;
export type YetkinlikForm = z.infer<typeof yetkinlikSemasi>;
export type ReferansForm = z.infer<typeof referansSemasi>;
export type KayitForm = z.infer<typeof kayitFormSemasi>;

/** Referans formu için kullanılan tip (Step3'te props olarak kullanılır) */
export type FormReferans = z.infer<typeof referansSemasi>;

// İhale oluşturma şeması ui/formlar backend API taraflarında kullanılacağı için güncellenmeli ama client tarafı kendisi validasyon yapıyor olabilir.
