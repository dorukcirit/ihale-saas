/**
 * Takip Edilen İhaleler sayfası — Firmanın favori/takip listesindeki ihaleler.
 * Son tarih yaklaşanlar vurgulu gösterilir.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Heart, HeartOff, Clock, MapPin, Building2, AlertTriangle } from "lucide-react";

// Mock takip edilen ihaleler
const MOCK_TAKIP = [
  {
    id: "IHL-2026-002",
    project_name: "İstanbul Kartal Rezidans Kaba Yapı",
    firm_name: "Doğan İnşaat A.Ş.",
    kategori: "Kaba Yapı Taşeronları",
    lokasyon: "İstanbul",
    sonTarih: "2026-04-20",
    durum: "active" as const,
    takipTarihi: "2026-03-12",
  },
  {
    id: "IHL-2026-003",
    project_name: "İzmir Bayraklı Çelik Konstrüksiyon",
    firm_name: "Ege Yapı Mühendislik",
    kategori: "Kaba Yapı Taşeronları",
    lokasyon: "İzmir",
    sonTarih: "2026-04-02",
    durum: "active" as const,
    takipTarihi: "2026-03-21",
  },
  {
    id: "IHL-2026-005",
    project_name: "Antalya Lara Havuz ve Peyzaj",
    firm_name: "Akdeniz Yapı Peyzaj",
    kategori: "Peyzaj ve Çevre Düzenleme",
    lokasyon: "Antalya",
    sonTarih: "2026-04-25",
    durum: "active" as const,
    takipTarihi: "2026-03-23",
  },
  {
    id: "IHL-2026-006",
    project_name: "Gaziantep Organize Sanayi Elektrik Tesisat",
    firm_name: "Güneydoğu Elektrik Müh.",
    kategori: "Mekanik, Elektrik ve Asansör",
    lokasyon: "Gaziantep",
    sonTarih: "2026-05-10",
    durum: "active" as const,
    takipTarihi: "2026-03-26",
  },
];

export default function TakiplerimPage() {
  const [takipListesi, setTakipListesi] = useState(MOCK_TAKIP);

  const kalanGun = (tarih: string) => {
    const fark = new Date(tarih).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(fark / (1000 * 60 * 60 * 24)));
  };

  const takiptenCikar = (id: string) => {
    setTakipListesi(prev => prev.filter(t => t.id !== id));
  };

  // Son tarih yaklaşanları üste sırala
  const sirali = [...takipListesi].sort(
    (a, b) => new Date(a.sonTarih).getTime() - new Date(b.sonTarih).getTime()
  );

  return (
    <DashboardLayout>
      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
          Takip Edilen İhaleler
        </h1>
        <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
          İlgilendiğiniz ihaleleri takip edin, son tarihleri kaçırmayın.
        </p>
      </div>

      {/* Özet */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <div style={{
          background: "white", borderRadius: 14, padding: "16px 24px",
          border: "1px solid var(--steel-200)", display: "flex", alignItems: "center", gap: 14,
        }}>
          <Heart size={20} color="var(--accent-red)" fill="var(--accent-red)" />
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--steel-400)", textTransform: "uppercase" }}>Takip Edilen</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy-900)" }}>{takipListesi.length}</p>
          </div>
        </div>
        <div style={{
          background: "white", borderRadius: 14, padding: "16px 24px",
          border: "1px solid var(--steel-200)", display: "flex", alignItems: "center", gap: 14,
        }}>
          <AlertTriangle size={20} color="var(--accent-amber)" />
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--steel-400)", textTransform: "uppercase" }}>Yaklaşan Tarih</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-amber)" }}>
              {takipListesi.filter(t => kalanGun(t.sonTarih) <= 7).length}
            </p>
          </div>
        </div>
      </div>

      {/* İhale Listesi */}
      {sirali.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          border: "1px dashed var(--steel-200)", borderRadius: 16,
        }}>
          <Heart size={48} color="var(--steel-300)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--steel-500)", marginBottom: 8 }}>
            Henüz takip edilen ihale yok
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--steel-400)", marginBottom: 24 }}>
            İhale listesinde ilginizi çeken ihaleleri takip listesine ekleyin.
          </p>
          <Link href="/ihaleler" className="btn-primary" style={{ textDecoration: "none", padding: "10px 24px" }}>
            İhaleleri Keşfet
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sirali.map(ihale => {
            const kalan = kalanGun(ihale.sonTarih);
            const acil = kalan <= 7;
            return (
              <div key={ihale.id} style={{
                background: "white",
                border: acil ? "1px solid rgba(245,158,11,0.3)" : "1px solid var(--steel-200)",
                borderRadius: 16,
                padding: "20px 24px",
                transition: "all 0.2s",
                borderLeft: acil ? "4px solid var(--accent-amber)" : "4px solid transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    {/* Acil uyarı */}
                    {acil && (
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "3px 10px", borderRadius: 100, marginBottom: 8,
                        background: "rgba(245,158,11,0.08)", color: "var(--accent-amber)",
                        fontSize: "0.72rem", fontWeight: 700,
                      }}>
                        <AlertTriangle size={12} /> Son {kalan} gün!
                      </div>
                    )}

                    <Link href={`/ihale/${ihale.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8, cursor: "pointer" }}>
                        {ihale.project_name}
                      </h3>
                    </Link>

                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                        <Building2 size={14} /> {ihale.firm_name}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                        <MapPin size={14} /> {ihale.lokasyon}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: acil ? "var(--accent-amber)" : "var(--steel-500)", fontWeight: acil ? 700 : 500 }}>
                        <Clock size={14} /> {kalan} gün kaldı
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Link href={`/ihale/${ihale.id}`} style={{
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid var(--steel-200)", background: "white",
                      color: "var(--navy-700)", fontSize: "0.82rem", fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      Detay
                    </Link>
                    <button
                      onClick={() => takiptenCikar(ihale.id)}
                      title="Takipten çıkar"
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: "1px solid var(--steel-200)", background: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "var(--steel-400)", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "var(--accent-red)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--steel-200)"; e.currentTarget.style.color = "var(--steel-400)"; }}
                    >
                      <HeartOff size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
