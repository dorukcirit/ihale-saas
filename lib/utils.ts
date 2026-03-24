/**
 * Genel yardımcı fonksiyonlar.
 * Tailwind class birleştirme ve veri maskeleme işlemleri.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını birleştir (clsx + twMerge) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Firma adını maskele: "Yılmaz İnşaat" → "Y*** İnşaat" */
export function maskeFirmaAdi(ad: string): string {
  if (!ad) return "***";
  const parcalar = ad.split(" ");
  return parcalar
    .map((p) => (p.length > 1 ? p[0] + "***" : p))
    .join(" ");
}

/** Proje adını maskele: "Kadıköy Konut Projesi" → "K**** Konut Projesi" */
export function maskeProjeAdi(ad: string): string {
  if (!ad) return "****";
  const parcalar = ad.split(" ");
  if (parcalar.length <= 1) return ad[0] + "****";
  return (
    parcalar[0][0] +
    "****" +
    " " +
    parcalar.slice(1).join(" ")
  );
}

/** Telefon numarasını maskele: "05321234567" → "0532 *** ** 67" */
export function maskeTelefon(tel: string): string {
  if (!tel || tel.length < 4) return "*** *** ****";
  return tel.slice(0, 4) + " *** ** " + tel.slice(-2);
}

/** E-posta maskele: "ahmet@gmail.com" → "ah***@gmail.com" */
export function maskeEmail(email: string): string {
  if (!email) return "***@***.com";
  const [kullanici, domain] = email.split("@");
  if (!kullanici || !domain) return "***@***.com";
  return kullanici.slice(0, 2) + "***@" + domain;
}

/** Tarihi tr-TR locale ile formatla */
export function tarihFormatla(tarih: Date | string): string {
  const d = typeof tarih === "string" ? new Date(tarih) : tarih;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Kalan gün sayısını hesapla */
export function kalanGun(bitisTarihi: Date | string): number {
  const bitis =
    typeof bitisTarihi === "string"
      ? new Date(bitisTarihi)
      : bitisTarihi;
  const bugun = new Date();
  const fark = bitis.getTime() - bugun.getTime();
  return Math.max(0, Math.ceil(fark / (1000 * 60 * 60 * 24)));
}
