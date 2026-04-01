/**
 * Çıkılan İhaleler sayfası — Firmanın kendi yayınladığı ihaleleri listeler.
 * Durum filtreleme (aktif, tamamlanan, iptal) ve ihale yönetimi.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PlusCircle, Eye, Send, Clock, MoreVertical, Filter } from "lucide-react";

// Mock — firmanın kendi ihaleleri
const MOCK_IHALELERIM = [
  {
    id: "IHL-2026-001",
    project_name: "Ankara Merkez Ofis İnce İşler Taşeronluğu",
    kategori: "İnce İnşaat ve Dekorasyon",
    lokasyon: "Ankara",
    sonTarih: "2026-04-15",
    durum: "active" as const,
    goruntulenme: 142,
    teklifSayisi: 3,
    yayinTarihi: "2026-03-15",
  },
  {
    id: "IHL-2026-007",
    project_name: "İstanbul Maslak Kule Projesi Asansör İşleri",
    kategori: "Mekanik, Elektrik ve Asansör",
    lokasyon: "İstanbul",
    sonTarih: "2026-03-28",
    durum: "completed" as const,
    goruntulenme: 312,
    teklifSayisi: 12,
    yayinTarihi: "2026-02-20",
  },
  {
    id: "IHL-2026-008",
    project_name: "Bursa Osmangazi Peyzaj Düzenleme",
    kategori: "Peyzaj ve Çevre Düzenleme",
    lokasyon: "Bursa",
    sonTarih: "2026-05-01",
    durum: "draft" as const,
    goruntulenme: 0,
    teklifSayisi: 0,
    yayinTarihi: "2026-03-28",
  },
];

const DURUM_FILTRE = [
  { value: "all", label: "Tümü" },
  { value: "active", label: "Aktif" },
  { value: "completed", label: "Tamamlanan" },
  { value: "draft", label: "Taslak" },
  { value: "cancelled", label: "İptal" },
];

const BADGE_MAP: Record<string, { className: string; label: string }> = {
  active:    { className: "badge badge-active",    label: "Aktif" },
  completed: { className: "badge badge-completed", label: "Tamamlandı" },
  draft:     { className: "badge badge-draft",     label: "Taslak" },
  cancelled: { className: "badge badge-cancelled", label: "İptal" },
};

export default function IhalelerimPage() {
  const [filtre, setFiltre] = useState("all");

  const filtrelenmis = MOCK_IHALELERIM.filter(
    ihale => filtre === "all" || ihale.durum === filtre
  );

  const kalanGun = (tarih: string) => {
    const fark = new Date(tarih).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(fark / (1000 * 60 * 60 * 24)));
  };

  return (
    <DashboardLayout>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
            Çıkılan İhaleler
          </h1>
          <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
            Firmanız tarafından yayınlanan tüm ihaleler ve durumları.
          </p>
        </div>
        <Link
          href="/ihale/yeni"
          className="btn-primary"
          style={{ padding: "12px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
        >
          <PlusCircle size={18} /> Yeni İhale
        </Link>
      </div>

      {/* İstatistikler */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Toplam İhale", deger: MOCK_IHALELERIM.length, renk: "var(--navy-500)" },
          { label: "Aktif", deger: MOCK_IHALELERIM.filter(i => i.durum === "active").length, renk: "var(--accent-green)" },
          { label: "Tamamlanan", deger: MOCK_IHALELERIM.filter(i => i.durum === "completed").length, renk: "var(--steel-500)" },
          { label: "Toplam Teklif", deger: MOCK_IHALELERIM.reduce((t, i) => t + i.teklifSayisi, 0), renk: "var(--accent-blue)" },
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: "white", borderRadius: 14, padding: "20px",
            border: "1px solid var(--steel-200)",
          }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--steel-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.renk }}>{stat.deger}</p>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {DURUM_FILTRE.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            style={{
              padding: "8px 16px", borderRadius: 100,
              border: filtre === f.value ? "1.5px solid var(--navy-500)" : "1.5px solid var(--steel-200)",
              background: filtre === f.value ? "rgba(30,77,140,0.06)" : "white",
              color: filtre === f.value ? "var(--navy-600)" : "var(--steel-600)",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* İhale Kartları */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtrelenmis.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
            border: "1px dashed var(--steel-200)", borderRadius: 16,
            color: "var(--steel-400)",
          }}>
            <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>Bu filtreye uygun ihale bulunamadı</p>
            <p style={{ fontSize: "0.85rem" }}>Farklı bir filtre deneyin veya yeni ihale oluşturun.</p>
          </div>
        ) : (
          filtrelenmis.map(ihale => {
            const badge = BADGE_MAP[ihale.durum];
            return (
              <div key={ihale.id} style={{
                background: "white",
                border: "1px solid var(--steel-200)",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className={badge.className}>{badge.label}</span>
                    <span style={{ color: "var(--steel-400)", fontSize: "0.78rem" }}>{ihale.id}</span>
                  </div>
                  <Link href={`/ihale/${ihale.id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8, cursor: "pointer" }}>
                      {ihale.project_name}
                    </h3>
                  </Link>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--steel-500)" }}>
                      <Eye size={13} /> {ihale.goruntulenme}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--steel-500)" }}>
                      <Send size={13} /> {ihale.teklifSayisi} teklif
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--steel-500)" }}>
                      <Clock size={13} /> {ihale.durum === "active" ? `${kalanGun(ihale.sonTarih)} gün kaldı` : "Sona erdi"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 100,
                    background: "rgba(30,77,140,0.06)", color: "var(--navy-600)",
                    fontSize: "0.72rem", fontWeight: 600,
                  }}>
                    {ihale.kategori}
                  </span>
                  <Link href={`/ihale/${ihale.id}`} style={{
                    padding: "8px 16px", borderRadius: 8,
                    border: "1px solid var(--steel-200)", background: "white",
                    color: "var(--navy-700)", fontSize: "0.82rem", fontWeight: 600,
                    textDecoration: "none", transition: "all 0.2s"
                  }}>
                    Detay
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
