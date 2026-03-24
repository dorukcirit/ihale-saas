/**
 * 3 Aşamalı Kayıt Formu — Ana sayfa bileşeni.
 * Wizard yapısı ile adım adım firma kaydı.
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Step1FirmInfo from "@/components/auth/Step1FirmInfo";
import Step2Competencies from "@/components/auth/Step2Competencies";
import Step3References from "@/components/auth/Step3References";

const ADIMLAR = [
  { no: 1, baslik: "Firma Bilgileri", aciklama: "Temel şirket bilgilerinizi girin" },
  { no: 2, baslik: "Yetkinlik Alanları", aciklama: "Uzmanlık alanlarınızı seçin" },
  { no: 3, baslik: "Referanslar", aciklama: "İş deneyimlerinizi ekleyin" },
];

export default function KayitPage() {
  const [aktifAdim, setAktifAdim] = useState(1);
  const [formVerisi, setFormVerisi] = useState({
    firma: { name: "", tax_number: "", authorized_person: "", email: "", phone: "" },
    competencies: [] as string[],
    references: [] as Array<{ employer: string; subject: string; year: number; location: string }>,
    balance_sheet: "",
    risk_report: "",
  });

  const ileri = () => setAktifAdim(prev => Math.min(prev + 1, 3));
  const geri = () => setAktifAdim(prev => Math.max(prev - 1, 1));

  const firmaGuncelle = (data: typeof formVerisi.firma) => {
    setFormVerisi(prev => ({ ...prev, firma: data }));
    ileri();
  };

  const yetkinlikGuncelle = (ids: string[]) => {
    setFormVerisi(prev => ({ ...prev, competencies: ids }));
    ileri();
  };

  const referansGuncelle = async (refs: typeof formVerisi.references, balanceSheet: string, riskReport: string) => {
    setFormVerisi(prev => ({ ...prev, references: refs, balance_sheet: balanceSheet, risk_report: riskReport }));
    
    // 7 haneli rastgele bir firma kodu oluşturuyoruz
    const firmaId = Math.floor(1000000 + Math.random() * 9000000);
    
    const yeniFirma = {
      id: firmaId,
      ad: formVerisi.firma.name || "Test Firması A.Ş.",
      uyelik: "Standart",
      durum: "Onay Bekliyor",
      tarih: new Date().toISOString().split("T")[0],
      not: "Sistemden yeni kayıt oldu.",
      detay: { ...formVerisi, references: refs, balance_sheet: balanceSheet, risk_report: riskReport }
    };

    // Admin panelinde görebilmek için localStorage'a kaydediyoruz (Demo amaçlı backend simülasyonu)
    const mevcutFirmalar = JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]");
    localStorage.setItem("yeni_kayitlar", JSON.stringify([...mevcutFirmalar, yeniFirma]));

    // Proye klasörününün içinde 'local_database' oluşturarak fiziksel inceleme imkanı (API POST)
    try {
      await fetch("/api/firma/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniFirma),
      });
    } catch (e) {
      console.error("Local kayıt API hatası", e);
    }

    alert(`Kayıt işleminiz başarıyla alınmıştır.\n\nFirma Numaranız: ${firmaId}\n\nOnay süreciniz tamamlandıktan sonra bu numara ile işlemleriniz eşleşecektir.`);
    window.location.href = "/auth/giris";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "50px 16px",
      backgroundImage: "radial-gradient(at 100% 0%, rgba(30, 77, 140, 0.03) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(30, 77, 140, 0.03) 0px, transparent 50%)"
    }}>
      <div style={{ width: "100%", maxWidth: 840 }}>
        {/* Logo (Sol Üst - Sabit) */}
        <div style={{ position: "absolute", top: 32, left: 40 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #1E4D8C, #2E6AB4)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={22} color="white" />
            </div>
            <span style={{ color: "var(--navy-900)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              İnşaat <span style={{ color: "var(--navy-500)" }}>Duvarı</span>
            </span>
          </Link>
        </div>

        {/* Adım göstergesi */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          {ADIMLAR.map((adim, i) => (
            <div key={adim.no} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", fontWeight: 700,
                background: aktifAdim >= adim.no
                  ? "var(--navy-500)"
                  : "var(--steel-50)",
                color: aktifAdim >= adim.no ? "white" : "var(--steel-400)",
                border: aktifAdim >= adim.no ? "none" : "1px solid var(--steel-200)",
                transition: "all 0.3s ease",
              }}>
                {adim.no}
              </div>
              {i < ADIMLAR.length - 1 && (
                <div style={{
                  width: 60, height: 2,
                  background: aktifAdim > adim.no
                    ? "var(--navy-500)"
                    : "var(--steel-200)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Adım başlığı */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ color: "var(--navy-900)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>
            {ADIMLAR[aktifAdim - 1].baslik}
          </h2>
          <p style={{ color: "var(--steel-500)", fontSize: "0.95rem" }}>
            {ADIMLAR[aktifAdim - 1].aciklama}
          </p>
        </div>

        {/* Form kartı */}
        <div style={{
          background: "white",
          padding: 40,
          borderRadius: 24,
          border: "1px solid var(--steel-200)",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={aktifAdim}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {aktifAdim === 1 && (
                <Step1FirmInfo
                  varsayilan={formVerisi.firma}
                  onSubmit={firmaGuncelle}
                />
              )}
              {aktifAdim === 2 && (
                <Step2Competencies
                  seciliIds={formVerisi.competencies}
                  onSubmit={yetkinlikGuncelle}
                  onBack={geri}
                />
              )}
              {aktifAdim === 3 && (
                <Step3References
                  varsayilanReferanslar={formVerisi.references}
                  varsayilanBilanco={formVerisi.balance_sheet}
                  varsayilanRisk={formVerisi.risk_report}
                  onSubmit={referansGuncelle}
                  onBack={geri}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Alt link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "var(--steel-500)", fontSize: "0.9rem" }}>
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/giris" style={{ color: "var(--navy-600)", textDecoration: "none", fontWeight: 700 }}>
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
