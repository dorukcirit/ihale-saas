/**
 * Özellikler bölümü.
 * Platform avantajlarını gösteren 3 sütunlu kart yapısı.
 */
"use client";

import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Users, FileCheck, Bell } from "lucide-react";

const OZELLIKLER = [
  {
    icon: Shield,
    baslik: "KVKK Uyumlu Güvenlik",
    aciklama: "Tüm veriler maskelenir, hassas bilgiler sadece yetkili üyelere gösterilir. RLS ile veritabanı seviyesinde koruma.",
    renk: "#3B82F6",
  },
  {
    icon: Zap,
    baslik: "Hızlı İhale Yayınlama",
    aciklama: "Dakikalar içinde ihale oluşturun. Taslak kaydedin, hazır olunca yayınlayın. Otomatik süre takibi.",
    renk: "#F59E0B",
  },
  {
    icon: BarChart3,
    baslik: "Teklif Yönetimi",
    aciklama: "Gelen teklifleri karşılaştırın, değerlendirin. Şeffaf ve yapılandırılmış karar süreci.",
    renk: "#10B981",
  },
  {
    icon: Users,
    baslik: "Geniş Tedarikçi Ağı",
    aciklama: "Sektöördeki yetkin firmaları keşfedin. Yetkinlik bazlı eşleştirme ile doğru tedarikçiye ulaşın.",
    renk: "#8B5CF6",
  },
  {
    icon: FileCheck,
    baslik: "Kurumsal Doğrulama",
    aciklama: "Vergi levhası, referanslar ve mali verilerle güvenilirlik puanı. Doğrulanmış firma profilleri.",
    renk: "#EC4899",
  },
  {
    icon: Bell,
    baslik: "Anlık Bildirimler",
    aciklama: "Takip ettiğiniz ihalelerde değişiklik olduğunda anında haberdar olun. E-posta ve platform bildirimleri.",
    renk: "#14B8A6",
  },
];

export default function FeaturesSection() {
  return (
    <section id="ozellikler" style={{
      background: "#FFFFFF",
      padding: "100px 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "rgba(30,77,140,0.08)",
            color: "var(--navy-500)",
            borderRadius: 9999,
            fontSize: "0.78rem",
            fontWeight: 600,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>
            Neden İnşaat Duvarı?
          </span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--navy-900)", marginBottom: 12 }}>
            İhale Süreçlerinizi Dönüştürün
          </h2>
          <p style={{ color: "var(--steel-500)", maxWidth: 520, margin: "0 auto", fontSize: "0.95rem" }}>
            Kurumsal düzeyde güvenlik, hız ve şeffaflık bir arada.
          </p>
        </motion.div>

        {/* Kartlar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {OZELLIKLER.map((oz, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card"
              style={{ padding: 28, cursor: "default" }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: `${oz.renk}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <oz.icon size={24} color={oz.renk} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10, color: "var(--navy-900)" }}>
                {oz.baslik}
              </h3>
              <p style={{ color: "var(--steel-500)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {oz.aciklama}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
