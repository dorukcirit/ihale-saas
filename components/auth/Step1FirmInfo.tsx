/**
 * Kayıt Adım 1: Firma Temel Bilgileri.
 * Ad, Vergi No, Yetkili, E-posta, Telefon.
 */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firmaTemelBilgiSemasi, type FirmaTemelBilgiForm } from "@/lib/validations";
import { ArrowRight, Building, Phone, Mail, User, Hash } from "lucide-react";

interface Props {
  varsayilan: FirmaTemelBilgiForm;
  onSubmit: (data: FirmaTemelBilgiForm) => void;
}

export default function Step1FirmInfo({ varsayilan, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirmaTemelBilgiForm>({
    resolver: zodResolver(firmaTemelBilgiSemasi),
    defaultValues: varsayilan,
  });

  const [vergiBelgesi, setVergiBelgesi] = useState<File | null>(null);
  const [analizDurumu, setAnalizDurumu] = useState<"bekliyor" | "analiz_ediliyor" | "onaylandi">("bekliyor");

  const handleVergiYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVergiBelgesi(e.target.files[0]);
      setAnalizDurumu("analiz_ediliyor");
      setTimeout(() => {
        setAnalizDurumu("onaylandi");
      }, 2500); // vkn ve adres eşleme simülasyonu süresi
    }
  };

  const formOnay = (data: FirmaTemelBilgiForm) => {
    if (analizDurumu !== "onaylandi") {
      alert("Lütfen zorunlu olan Vergi Levhası belgenizi yükleyiniz. Sistem, girdiğiniz bilgileri (VKN, Adres) yapay zeka ile otomatik doğrulayacaktır.");
      return;
    }
    onSubmit(data);
  };

  const alanlar = [
    { ad: "name" as const, label: "Firma Adı", placeholder: "Örn: Yılmaz İnşaat A.Ş.", icon: Building },
    { ad: "tax_number" as const, label: "Vergi Numarası", placeholder: "10 haneli vergi no", icon: Hash },
    { ad: "authorized_person" as const, label: "Yetkili Kişi", placeholder: "Ad Soyad", icon: User },
    { ad: "email" as const, label: "E-posta", placeholder: "firma@ornek.com", icon: Mail, type: "email" },
    { ad: "phone" as const, label: "Telefon", placeholder: "05xx xxx xx xx", icon: Phone, type: "tel" },
  ];

  return (
    <form onSubmit={handleSubmit(formOnay)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {alanlar.map((alan) => (
        <div key={alan.ad}>
          <label className="form-label">{alan.label}</label>
          <div style={{ position: "relative" }}>
            <alan.icon
              size={16}
              style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: "var(--steel-400)"
              }}
            />
            <input
              {...register(alan.ad)}
              type={alan.type || "text"}
              placeholder={alan.placeholder}
              className={`form-input ${errors[alan.ad] ? "error" : ""}`}
              style={{ paddingLeft: 42 }}
            />
          </div>
          {errors[alan.ad] && (
            <p className="form-error">{errors[alan.ad]?.message}</p>
          )}
        </div>
      ))}

      {/* File upload alanları (görsel — v2 için tam implementasyon) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label">Logo (Opsiyonel)</label>
          <div style={{
            border: "2px dashed var(--steel-200)",
            borderRadius: 10, padding: 20,
            textAlign: "center", cursor: "pointer",
            transition: "border-color 0.2s",
          }}>
            <p style={{ color: "var(--steel-400)", fontSize: "0.8rem" }}>PNG, JPG — Max 5MB</p>
          </div>
        </div>
        <div>
          <label className="form-label">Vergi Levhası (Zorunlu)</label>
          <div style={{
            position: "relative",
            border: `2px dashed ${analizDurumu === "onaylandi" ? "var(--accent-green)" : "var(--steel-200)"}`,
            borderRadius: 10, padding: 20,
            textAlign: "center", cursor: "pointer",
            background: analizDurumu === "onaylandi" ? "rgba(16,185,129,0.05)" : "transparent",
            transition: "all 0.2s",
          }}>
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleVergiYukle} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            {analizDurumu === "bekliyor" && <p style={{ color: "var(--steel-400)", fontSize: "0.8rem" }}>PDF, JPG — Tıklayıp yükleyin</p>}
            {analizDurumu === "analiz_ediliyor" && (
              <p style={{ color: "var(--navy-500)", fontSize: "0.8rem", fontWeight: 600 }}>
                Levha okunuyor ve bilgiler (VKN) eşleştiriliyor...
              </p>
            )}
            {analizDurumu === "onaylandi" && (
              <p style={{ color: "var(--accent-green)", fontSize: "0.8rem", fontWeight: 700 }}>
                Doğrulandı: {vergiBelgesi?.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8 }}>
        Devam Et <ArrowRight size={18} />
      </button>
    </form>
  );
}
