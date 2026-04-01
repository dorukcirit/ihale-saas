/**
 * Dashboard sayfası — Genel Bakış (Özet) hub sayfası.
 * Her ana modüle hızlı erişim kartları ve özet istatistikler sunar.
 * Sidebar layout kullanarak diğer sayfalarla tutarlı navigasyon sağlar.
 */
"use client";

import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FileText, Search, Heart, Users, Settings,
  PlusCircle, TrendingUp, Eye, Send, ArrowUpRight,
  Clock, Building2
} from "lucide-react";

// Mock istatistikler
const ISTATISTIKLER = [
  { label: "Aktif İhalelerim", deger: 2, icon: FileText, renk: "var(--accent-green)", href: "/ihalelerim" },
  { label: "Toplam Teklif", deger: 15, icon: Send, renk: "var(--accent-blue)", href: "/ihalelerim" },
  { label: "Takip Edilen", deger: 4, icon: Heart, renk: "var(--accent-red)", href: "/takiplerim" },
  { label: "Görüntülenme", deger: 454, icon: Eye, renk: "var(--navy-500)", href: "/ihalelerim" },
];

const HIZLI_ERISIM = [
  {
    icon: PlusCircle,
    baslik: "Yeni İhale Oluştur",
    aciklama: "Projeniz için yeni bir ihale yayınlayın.",
    href: "/ihale/yeni",
    vurgu: true,
  },
  {
    icon: Search,
    baslik: "İhale Listesi",
    aciklama: "Aktif ihaleleri filtreleyin ve keşfedin.",
    href: "/ihaleler",
  },
  {
    icon: FileText,
    baslik: "Çıkılan İhaleler",
    aciklama: "Yayınladığınız ihaleleri yönetin.",
    href: "/ihalelerim",
  },
  {
    icon: Heart,
    baslik: "Takip Edilenler",
    aciklama: "İlgilendiğiniz ihaleleri görüntüleyin.",
    href: "/takiplerim",
  },
  {
    icon: Users,
    baslik: "Paydaşlar",
    aciklama: "Çözüm ortağı ağınızı keşfedin.",
    href: "/paydaslar",
  },
  {
    icon: Settings,
    baslik: "Firma Profili",
    aciklama: "Firma bilgilerinizi düzenleyin.",
    href: "/profil/duzenle",
  },
];

// Mock son ihale bildirimleri
const SON_ETKINLIKLER = [
  { mesaj: "IHL-2026-001 ihalesine yeni teklif geldi", zaman: "2 saat önce", tip: "teklif" },
  { mesaj: "Takip ettiğiniz IHL-2026-003 ihalesi 3 gün içinde sona eriyor", zaman: "5 saat önce", tip: "uyari" },
  { mesaj: "İhale IHL-2026-007 başarıyla tamamlandı", zaman: "Dün", tip: "basari" },
  { mesaj: "Profiliniz 24 kez görüntülendi", zaman: "Bu hafta", tip: "bilgi" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
          Genel Bakış
        </h1>
        <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
          Firma panelinize hoş geldiniz. İşte hızlı bir özet.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {ISTATISTIKLER.map((stat, idx) => (
          <Link key={idx} href={stat.href} style={{
            background: "white", borderRadius: 16, padding: "20px 24px",
            border: "1px solid var(--steel-200)",
            textDecoration: "none", transition: "all 0.2s",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          }}
          >
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--steel-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.renk }}>{stat.deger}</p>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${stat.renk}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <stat.icon size={20} color={stat.renk} />
            </div>
          </Link>
        ))}
      </div>

      {/* Ana Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

        {/* Sol — Hızlı Erişim Kartları */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} color="var(--navy-500)" /> Hızlı Erişim
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {HIZLI_ERISIM.map((item, idx) => (
              <Link key={idx} href={item.href} style={{
                background: item.vurgu
                  ? "linear-gradient(135deg, var(--navy-600), var(--navy-500))"
                  : "white",
                border: item.vurgu ? "none" : "1px solid var(--steel-200)",
                borderRadius: 16,
                padding: "20px",
                textDecoration: "none",
                transition: "all 0.25s",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: item.vurgu ? "rgba(255,255,255,0.15)" : "var(--steel-50)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <item.icon size={20} color={item.vurgu ? "white" : "var(--navy-500)"} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <h3 style={{
                      fontSize: "0.95rem", fontWeight: 700,
                      color: item.vurgu ? "white" : "var(--navy-900)",
                    }}>
                      {item.baslik}
                    </h3>
                    <ArrowUpRight size={14} color={item.vurgu ? "rgba(255,255,255,0.6)" : "var(--steel-400)"} />
                  </div>
                  <p style={{
                    fontSize: "0.82rem",
                    color: item.vurgu ? "rgba(255,255,255,0.7)" : "var(--steel-500)",
                    marginTop: 4,
                  }}>
                    {item.aciklama}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sağ — Son Etkinlikler */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} color="var(--navy-500)" /> Son Etkinlikler
          </h2>
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid var(--steel-200)",
            overflow: "hidden",
          }}>
            {SON_ETKINLIKLER.map((etkinlik, idx) => (
              <div key={idx} style={{
                padding: "16px 20px",
                borderBottom: idx < SON_ETKINLIKLER.length - 1 ? "1px solid var(--steel-100)" : "none",
              }}>
                <p style={{ fontSize: "0.88rem", color: "var(--navy-800)", fontWeight: 500, marginBottom: 4, lineHeight: 1.4 }}>
                  {etkinlik.mesaj}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--steel-400)" }}>{etkinlik.zaman}</p>
              </div>
            ))}
          </div>

          {/* Üyelik Özet */}
          <div style={{
            marginTop: 20,
            background: "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-600) 100%)",
            borderRadius: 16, padding: "24px", color: "white",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Building2 size={20} color="var(--accent-green)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Üyelik Durumu</h3>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
              Planınızı yükselterek daha fazla ihaleye erişin ve paydaş ağınızı genişletin.
            </p>
            <Link href="/abonelik" style={{
              display: "block", width: "100%", padding: "10px 0", borderRadius: 8,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              color: "white", fontSize: "0.85rem", fontWeight: 600,
              textAlign: "center", textDecoration: "none", transition: "all 0.2s",
            }}>
              Planları Görüntüle
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
