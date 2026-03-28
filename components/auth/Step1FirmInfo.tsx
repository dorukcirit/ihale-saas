"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { firmaTemelBilgiSemasi, type FirmaTemelBilgiForm } from "@/lib/validations";
import {
  ArrowRight, Building, Phone, Smartphone, Mail, User, Hash,
  Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, FileWarning, MapPin, Link as LinkIcon
} from "lucide-react";

interface Props {
  varsayilan: FirmaTemelBilgiForm;
  onSubmit: (data: FirmaTemelBilgiForm) => void;
}

// İzin verilen MIME tipleri ve uzantılar
const IZINLI_MIME = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const IZINLI_UZANTI = [".pdf", ".jpg", ".jpeg", ".png"];
const MIN_BOYUT_BAYT = 10 * 1024;

type AnalizDurum = "bekliyor" | "analiz_ediliyor" | "onaylandi" | "hata";

export default function Step1FirmInfo({ varsayilan, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FirmaTemelBilgiForm>({
    resolver: zodResolver(firmaTemelBilgiSemasi),
    defaultValues: { ...varsayilan, show_phone: false, show_email: false },
  });

  const [showSifre, setShowSifre] = useState(false);
  const [showSifreTekrar, setShowSifreTekrar] = useState(false);

  // Vergi levhası durumu
  const [vergiBelgesi, setVergiBelgesi] = useState<File | null>(null);
  const [analizDurum, setAnalizDurum] = useState<AnalizDurum>("bekliyor");
  const [hataMesaj, setHataMesaj] = useState("");
  const dosyaRef = useRef<HTMLInputElement>(null);

  const handleVergiYukle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    setHataMesaj("");
    setVergiBelgesi(null);
    setAnalizDurum("bekliyor");

    if (!IZINLI_MIME.includes(dosya.type)) {
      setAnalizDurum("hata");
      setHataMesaj("Geçersiz dosya türü. Yalnızca PDF, JPG veya PNG kabul edilir.");
      if (dosyaRef.current) dosyaRef.current.value = "";
      return;
    }

    const adKucuk = dosya.name.toLowerCase();
    if (!IZINLI_UZANTI.some((u) => adKucuk.endsWith(u))) {
      setAnalizDurum("hata");
      setHataMesaj("Uzantı uyumsuzluğu (.pdf, .jpg, .png)");
      if (dosyaRef.current) dosyaRef.current.value = "";
      return;
    }

    if (dosya.size < MIN_BOYUT_BAYT) {
      setAnalizDurum("hata");
      setHataMesaj("Dosya çok küçük. Gerçek bir vergi levhası en az 10 KB olmalıdır.");
      if (dosyaRef.current) dosyaRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const arr = new Uint8Array(ev.target?.result as ArrayBuffer);
      const header = Array.from(arr.slice(0, 4)).map((b) => String.fromCharCode(b)).join("");
      const isPdf = header.startsWith("%PDF");
      const isJpeg = arr[0] === 0xff && arr[1] === 0xd8;
      const isPng = arr[0] === 0x89 && arr[1] === 0x50;

      if (!isPdf && !isJpeg && !isPng) {
        setAnalizDurum("hata");
        setHataMesaj("Dosya içeriği tanımlanamadı.");
        if (dosyaRef.current) dosyaRef.current.value = "";
        return;
      }
      setVergiBelgesi(dosya);
      setAnalizDurum("analiz_ediliyor");
      setTimeout(() => setAnalizDurum("onaylandi"), 1500);
    };
    reader.readAsArrayBuffer(dosya.slice(0, 8));
  };

  const formOnay = (data: FirmaTemelBilgiForm) => {
    if (analizDurum !== "onaylandi") {
      alert("Lütfen zorunlu olan Vergi Levhası belgenizi yükleyiniz ve onaylanmasını bekleyiniz.");
      return;
    }
    onSubmit(data);
  };

  const inputStyle = (hata: boolean): React.CSSProperties => ({
    width: "100%", height: 50, padding: "0 14px 0 42px",
    background: "var(--steel-50)",
    border: `1px solid ${hata ? "var(--accent-red)" : "var(--steel-200)"}`,
    borderRadius: 12, color: "var(--navy-900)", fontSize: "0.95rem",
    outline: "none", transition: "all 0.2s",
    boxSizing: "border-box",
  });

  return (
    <form onSubmit={handleSubmit(formOnay)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label">Firma Adı</label>
          <div style={{ position: "relative" }}>
            <Building size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("name")} placeholder="Örn: Yılmaz İnşaat A.Ş." style={inputStyle(!!errors.name)} />
          </div>
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="form-label">Vergi Numarası</label>
          <div style={{ position: "relative" }}>
            <Hash size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("tax_number")} placeholder="10 haneli vergi no" style={inputStyle(!!errors.tax_number)} />
          </div>
          {errors.tax_number && <p className="form-error">{errors.tax_number.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Açık Adres</label>
        <div style={{ position: "relative" }}>
          <MapPin size={16} style={{ position: "absolute", left: 14, top: "20px", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
          <textarea {...register("address")} rows={3} placeholder="Firma açık adresi" style={{...inputStyle(!!errors.address), height: 'auto', paddingTop: 14, paddingBottom: 14, resize: 'vertical'}} />
        </div>
        {errors.address && <p className="form-error">{errors.address.message}</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label">Yetkili Kişi</label>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("authorized_person")} placeholder="Ad Soyad" style={inputStyle(!!errors.authorized_person)} />
          </div>
          {errors.authorized_person && <p className="form-error">{errors.authorized_person.message}</p>}
        </div>
        <div>
          <label className="form-label">Web Sitesi (Opsiyonel)</label>
          <div style={{ position: "relative" }}>
            <LinkIcon size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("website")} placeholder="https://..." style={inputStyle(!!errors.website)} />
          </div>
          {errors.website && <p className="form-error">{errors.website.message}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
            E-posta Adresi
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "var(--navy-600)" }}>
              <input type="checkbox" {...register("show_email")} /> Profili Ziyaret Edenler Görsün
            </label>
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input type="email" {...register("email")} placeholder="firma@ornek.com" style={inputStyle(!!errors.email)} />
          </div>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
            İletişim Numarası
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "var(--navy-600)" }}>
              <input type="checkbox" {...register("show_phone")} /> Profili Ziyaret Edenler Görsün
            </label>
          </label>
          <div style={{ position: "relative" }}>
            <Smartphone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input type="tel" {...register("kayit_telefonu")} placeholder="05xx xxx xx xx" style={inputStyle(!!errors.kayit_telefonu)} />
          </div>
          {errors.kayit_telefonu && <p className="form-error">{errors.kayit_telefonu.message}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label">Şifre</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("sifre")} type={showSifre ? "text" : "password"} placeholder="En az 8 karakter" style={{ ...inputStyle(!!errors.sifre), paddingRight: 44 }} />
            <button type="button" onClick={() => setShowSifre(!showSifre)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--steel-400)", cursor: "pointer" }}>
              {showSifre ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.sifre && <p className="form-error">{errors.sifre.message}</p>}
        </div>
        <div>
          <label className="form-label">Şifre Tekrar</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
            <input {...register("sifre_tekrar")} type={showSifreTekrar ? "text" : "password"} placeholder="Şifreyi tekrar girin" style={{ ...inputStyle(!!errors.sifre_tekrar), paddingRight: 44 }} />
            <button type="button" onClick={() => setShowSifreTekrar(!showSifreTekrar)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--steel-400)", cursor: "pointer" }}>
              {showSifreTekrar ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.sifre_tekrar && <p className="form-error">{errors.sifre_tekrar.message}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="form-label">Logo (Opsiyonel)</label>
          <div style={{ border: "2px dashed var(--steel-200)", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer" }}>
            <p style={{ color: "var(--steel-400)", fontSize: "0.8rem" }}>PNG, JPG — Max 5 MB</p>
          </div>
        </div>

        <div>
          <label className="form-label">
            Vergi Levhası <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>*</span>
          </label>
          <div style={{
              position: "relative",
              border: `2px dashed ${analizDurum === "onaylandi" ? "var(--accent-green)" : analizDurum === "hata" ? "var(--accent-red)" : "var(--steel-200)"}`,
              borderRadius: 10, padding: 16, textAlign: "center", cursor: "pointer",
              background: analizDurum === "onaylandi" ? "rgba(16,185,129,0.05)" : analizDurum === "hata" ? "rgba(239,68,68,0.04)" : "transparent",
              minHeight: 72, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <input ref={dosyaRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleVergiYukle} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            {analizDurum === "bekliyor" && <p style={{ color: "var(--steel-400)", fontSize: "0.78rem" }}>PDF, JPG, PNG — Tıklayıp yükleyin</p>}
            {analizDurum === "analiz_ediliyor" && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--navy-500)", fontSize: "0.78rem", fontWeight: 600 }}><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analiz ediliyor...</span>}
            {analizDurum === "onaylandi" && <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-green)", fontSize: "0.78rem", fontWeight: 700 }}><CheckCircle2 size={14} /> Doğrulandı</span>}
            {analizDurum === "hata" && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-red)", fontSize: "0.78rem", fontWeight: 600, flexDirection: "column" }}>
                <span><FileWarning size={14} /> Doğrulama Başarısız</span>
                <span style={{ fontSize: "0.72rem", color: "var(--steel-600)" }}>{hataMesaj}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8 }}>
        Devam Et <ArrowRight size={18} />
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
