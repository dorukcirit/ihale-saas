/**
 * Maskelenmiş İhale Panosu bileşeni.
 * KVKK uyumlu, firma/proje adları gizlenmiş canlı ihale akışı.
 * Üyelik teşviki için blur efekti ve kilit ikonu gösterir.
 */
"use client";

import { motion } from "framer-motion";
import { Lock, MapPin, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

/** Demo maskelenmiş ihale verisi */
const DEMO_VERI: any[] = [];

function IhaleKarti({ ihale, index }: { ihale: typeof DEMO_VERI[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: "var(--white)",
        border: "1px solid var(--steel-200)",
        borderRadius: 12,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        transition: "all 0.25s ease",
        cursor: "default",
        flexWrap: "wrap",
        boxShadow: "var(--shadow-sm)",
      }}
      whileHover={{
        background: "var(--steel-50)",
        borderColor: "var(--steel-300)",
        transform: "translateY(-1px)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Lock size={13} color="var(--navy-300)" />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span className="blur-mask" style={{ color: "var(--navy-900)", fontWeight: 600, fontSize: "0.95rem", display: "inline-block" }}>
              {ihale.firma}
            </span>
          </div>
          <span style={{ color: "var(--steel-300)", fontSize: "0.85rem" }}>—</span>
          <h3 className="blur-mask" style={{ color: "var(--steel-600)", fontSize: "0.9rem", display: "inline-block" }}>
            {ihale.proje}
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.8rem" }}>
            <MapPin size={12} /> {ihale.konum}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.8rem" }}>
            <Calendar size={13} /> {new Date(ihale.son).toLocaleDateString("tr-TR")}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          padding: "4px 12px",
          background: "var(--steel-100)",
          color: "var(--navy-600)",
          borderRadius: 8,
          fontSize: "0.78rem",
          fontWeight: 600
        }}>
          {ihale.imalat}
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: 4,
          color: ihale.gun <= 7 ? "var(--accent-amber)" : "var(--steel-400)",
          fontSize: "0.8rem", fontWeight: 600
        }}>
          <Clock size={12} />
          {ihale.gun} gün
        </span>
      </div>
    </motion.div>
  );
}

export default function MaskedTenderBoard() {
  const filteredVeri = DEMO_VERI;

  return (
    <section id="ihaleler" style={{
      position: "relative",
      background: "#FFFFFF",
      padding: "80px 24px 100px",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "rgba(245,158,11,0.1)",
            color: "#F59E0B",
            borderRadius: 9999,
            fontSize: "0.78rem",
            fontWeight: 600,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>
            Canlı İhale Akışı
          </span>
          <h2 style={{ color: "var(--navy-900)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, marginBottom: 12 }}>
            Aktif İhaleler
          </h2>
          <p style={{ color: "var(--steel-500)", maxWidth: 480, margin: "0 auto", fontSize: "0.95rem" }}>
            KVKK gereği firma ve proje bilgileri gizlidir. Detayları görmek için üye olun.
          </p>
        </motion.div>



        {/* İhale Listesi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
          {filteredVeri.map((ihale, i) => (
            <IhaleKarti key={ihale.id} ihale={ihale} index={i} />
          ))}

          {/* Alt blur gradient — daha fazla ihale var etkisi */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 120,
            background: "linear-gradient(transparent, #FFFFFF)",
            pointerEvents: "none",
          }} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <Link href="/auth/kayit" className="btn-primary" style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
            Tüm İhaleleri Gör <ArrowRight size={18} />
          </Link>
          <p style={{ color: "var(--steel-400)", fontSize: "0.8rem", marginTop: 12 }}>
            Ücretsiz kayıt ol, tüm ihale detaylarına eriş.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
