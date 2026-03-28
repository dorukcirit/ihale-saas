/**
 * Landing Hero Billboard bileşeni.
 * Animasyonlu slogan, CTA butonları ve dekoratif grid arka plan.
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Users, TrendingUp, FileStack } from "lucide-react";

export default function HeroBillboard() {
  const [gercekFirmaSayisi, setGercekFirmaSayisi] = useState(0);
  const [gercekAktifIhale, setGercekAktifIhale] = useState(0);
  const [gercekToplamIhale, setGercekToplamIhale] = useState(0);

  useEffect(() => {
    // Sistemdeki güncel firma sayısını ve (eğer varsa) ihale sayısını okuyoruz
    // (Şimdilik localStorage'dan okunuyor, Backend bağlandığında API'den gelecek)
    const yeniKayitlar = JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]");
    const aktifIhalelerList = JSON.parse(localStorage.getItem("mock_aktif_ihaleler") || "[]");
    const bitenIhalelerList = JSON.parse(localStorage.getItem("mock_bitmis_ihaleler") || "[]");
    
    setGercekFirmaSayisi(yeniKayitlar.length);
    setGercekAktifIhale(aktifIhalelerList.length);
    setGercekToplamIhale(aktifIhalelerList.length + bitenIhalelerList.length);
  }, []);

  // Formatlayıcılar
  const getFirmaText = (count: number) => {
    if (count === 0) return "0";
    if (count < 100) return count.toString(); // 100'e kadar tam sayıyı göster
    if (count >= 100 && count < 200) return "100+";
    if (count >= 200 && count < 500) return "200+";
    if (count >= 500 && count < 1000) return "500+";
    if (count >= 1000 && count < 1500) return "1000+";
    if (count >= 1500 && count < 2000) return "1500+";
    
    // 2000'den sonra 1000'er artsın
    const floor = Math.floor(count / 1000) * 1000;
    return floor + "+";
  };

  const getAktifIhaleText = (count: number) => {
    if (count === 0) return "0";
    if (count < 10) return count.toString();
    return Math.floor(count / 10) * 10 + "+"; // 10'arlı ilerleme
  };

  const getToplamIhaleText = (count: number) => {
    if (count === 0) return "0";
    if (count < 100) return count.toString();
    return Math.floor(count / 100) * 100 + "+"; // 100'erli ilerleme
  };

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FFFFFF",
      overflow: "hidden",
    }}>
      {/* Arka plan grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(10,22,40,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10,22,40,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.6,
      }} />

      {/* İçerik */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, padding: "120px 24px 80px" }}>

        {/* Üst badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px",
            background: "var(--steel-100)",
            border: "1px solid var(--steel-200)",
            borderRadius: 9999, color: "var(--navy-600)",
            fontSize: "0.85rem", fontWeight: 600,
          }}>
            <Shield size={14} />
            B2B İnşaat İhale Platformu
          </span>
        </motion.div>

        {/* Ana başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 800,
            color: "var(--navy-900)",
            lineHeight: 1.1,
            marginTop: 32,
            letterSpacing: "-0.03em",
          }}
        >
          Paydaşlarını{" "}
          <span style={{
            background: "linear-gradient(135deg, #5A8FD4, #2E6AB4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>arttır</span>,{" "}
          <br />
          pazarını{" "}
          <span style={{
            background: "linear-gradient(135deg, #5A8FD4, #2E6AB4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>arttır</span>.
        </motion.h1>

        {/* Alt açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            color: "var(--steel-600)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            maxWidth: 560,
            margin: "24px auto 0",
            lineHeight: 1.7,
          }}
        >
          İnşaat sektöründe ihaleleri dijitalleştirin. Güvenli, şeffaf ve
          hızlı B2B ihale yönetim platformu.
        </motion.p>

        {/* CTA Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 36, flexWrap: "wrap" }}
        >
          <Link href="/auth/kayit" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Kayıt Ol <ArrowRight size={18} />
          </Link>
          <Link href="#ihaleler" className="btn-secondary" style={{ 
            padding: "14px 32px", fontSize: "1rem", 
            border: "2px solid var(--steel-200)", 
            color: "var(--navy-800)" 
          }}>
            İhaleleri Gör
          </Link>
        </motion.div>


        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{
            display: "flex", justifyContent: "center", gap: 48,
            marginTop: 64, flexWrap: "wrap",
          }}
        >
          {[
            { icon: Users, label: "Kayıtlı Firma", value: getFirmaText(gercekFirmaSayisi) },
            { icon: TrendingUp, label: "Aktif İhale", value: getAktifIhaleText(gercekAktifIhale) },
            { icon: FileStack, label: "Toplam İhaleler", value: getToplamIhaleText(gercekToplamIhale) },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                <stat.icon size={18} color="var(--navy-400)" />
                <span style={{ color: "var(--navy-900)", fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</span>
              </div>
              <span style={{ color: "var(--steel-500)", fontSize: "0.8rem", fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
