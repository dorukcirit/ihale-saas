/**
 * Paydaşlar sayfası — Çözüm ortakları diğer firmaları keşfeder ve paydaş olarak seçer.
 * Erişim: Sadece Çözüm Ortağı (membership_type: 3) üyeler erişebilir.
 * İleride tüm üyelere açılabilir.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search, MapPin, Building2, BadgeCheck, Users,
  Star, Filter, ChevronDown, UserPlus, Check
} from "lucide-react";

// Mock firma verileri
const MOCK_FIRMALAR = [
  {
    id: "firma-001",
    name: "Yılmaz Yapı Ltd. Şti.",
    lokasyon: "Ankara",
    membership_type: 3,
    has_blue_tick: true,
    yetkinlikler: ["İnce İnşaat", "Kaba Yapı"],
    aktifIhale: 4,
    referansSayisi: 8,
  },
  {
    id: "firma-002",
    name: "Doğan İnşaat A.Ş.",
    lokasyon: "İstanbul",
    membership_type: 3,
    has_blue_tick: true,
    yetkinlikler: ["Kaba Yapı", "Zemin ve Altyapı"],
    aktifIhale: 7,
    referansSayisi: 15,
  },
  {
    id: "firma-003",
    name: "Ege Yapı Mühendislik",
    lokasyon: "İzmir",
    membership_type: 2,
    has_blue_tick: false,
    yetkinlikler: ["Çelik Konstrüksiyon", "Kaba Yapı"],
    aktifIhale: 2,
    referansSayisi: 5,
  },
  {
    id: "firma-004",
    name: "Akdeniz Yapı Peyzaj",
    lokasyon: "Antalya",
    membership_type: 2,
    has_blue_tick: true,
    yetkinlikler: ["Peyzaj", "Çevre Düzenleme"],
    aktifIhale: 3,
    referansSayisi: 6,
  },
  {
    id: "firma-005",
    name: "Marmara Grup İnşaat",
    lokasyon: "Bursa",
    membership_type: 3,
    has_blue_tick: true,
    yetkinlikler: ["İnce İnşaat", "Dekorasyon"],
    aktifIhale: 5,
    referansSayisi: 12,
  },
  {
    id: "firma-006",
    name: "Güneydoğu Elektrik Müh.",
    lokasyon: "Gaziantep",
    membership_type: 2,
    has_blue_tick: false,
    yetkinlikler: ["Elektrik Tesisat", "MEP"],
    aktifIhale: 1,
    referansSayisi: 3,
  },
];

const TIER_LABELS: Record<number, { ad: string; renk: string; arkaplan: string }> = {
  1: { ad: "Temel", renk: "var(--steel-600)", arkaplan: "var(--steel-100)" },
  2: { ad: "Uzman", renk: "var(--navy-600)", arkaplan: "rgba(30,77,140,0.08)" },
  3: { ad: "Çözüm Ortağı", renk: "#B8860B", arkaplan: "rgba(184,134,11,0.08)" },
};

export default function PaydaslarPage() {
  const [arama, setArama] = useState("");
  const [sehirFiltre, setSehirFiltre] = useState("Tümü");
  const [paydaslarim, setPaydaslarim] = useState<string[]>([]);

  const sehirler = ["Tümü", ...new Set(MOCK_FIRMALAR.map(f => f.lokasyon))];

  const filtrelenmis = MOCK_FIRMALAR.filter(firma => {
    const aramaUygun = arama === "" ||
      firma.name.toLowerCase().includes(arama.toLowerCase()) ||
      firma.yetkinlikler.some(y => y.toLowerCase().includes(arama.toLowerCase()));
    const sehirUygun = sehirFiltre === "Tümü" || firma.lokasyon === sehirFiltre;
    return aramaUygun && sehirUygun;
  });

  const paydasToggle = (id: string) => {
    setPaydaslarim(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <main>
      <Navbar />

      <div style={{ paddingTop: 100, minHeight: "100vh", background: "var(--steel-50)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Hero */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 8 }}>
              Paydaşlar
            </h1>
            <p style={{ color: "var(--steel-500)", fontSize: "0.95rem", maxWidth: 600 }}>
              Platform üzerindeki firmaları keşfedin, profillerini inceleyin ve çözüm ortağı ağınızı genişletin.
            </p>
          </div>

          {/* Seçili Paydaşlar Özet */}
          {paydaslarim.length > 0 && (
            <div style={{
              background: "rgba(16, 185, 129, 0.04)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              borderRadius: 14, padding: "14px 20px", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Users size={18} color="var(--accent-green)" />
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy-800)" }}>
                {paydaslarim.length} firma paydaş olarak seçildi
              </span>
            </div>
          )}

          {/* Filtreler */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
              <input
                type="text"
                placeholder="Firma adı veya yetkinlik ara..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
            <div style={{ position: "relative", minWidth: 180 }}>
              <Filter size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
              <select
                value={sehirFiltre}
                onChange={(e) => setSehirFiltre(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 38, appearance: "none" }}
              >
                {sehirler.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Sonuç */}
          <p style={{ fontSize: "0.82rem", color: "var(--steel-400)", marginBottom: 16, fontWeight: 500 }}>
            {filtrelenmis.length} firma bulundu
          </p>

          {/* Firma Kartları */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {filtrelenmis.map((firma) => {
              const tier = TIER_LABELS[firma.membership_type] || TIER_LABELS[1];
              const secili = paydaslarim.includes(firma.id);
              return (
                <div key={firma.id} style={{
                  background: "white",
                  border: secili ? "2px solid var(--accent-green)" : "1px solid var(--steel-200)",
                  borderRadius: 20,
                  padding: "24px",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { if (!secili) e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "linear-gradient(135deg, var(--navy-600), var(--navy-400))",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Building2 size={24} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-900)" }}>
                          {firma.name}
                        </h3>
                        {firma.has_blue_tick && <BadgeCheck size={16} color="var(--accent-blue)" />}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                          <MapPin size={13} /> {firma.lokasyon}
                        </span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 100,
                          background: tier.arkaplan, color: tier.renk,
                          fontSize: "0.68rem", fontWeight: 700,
                        }}>
                          {tier.ad}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Yetkinlikler */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {firma.yetkinlikler.map((yet, idx) => (
                      <span key={idx} style={{
                        padding: "4px 10px", borderRadius: 100,
                        background: "rgba(30,77,140,0.05)", color: "var(--navy-600)",
                        fontSize: "0.72rem", fontWeight: 600,
                      }}>
                        {yet}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: 20, marginBottom: 20, paddingTop: 12, borderTop: "1px solid var(--steel-100)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--steel-500)" }}>
                      <strong style={{ color: "var(--navy-800)" }}>{firma.aktifIhale}</strong> aktif ihale
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--steel-500)" }}>
                      <strong style={{ color: "var(--navy-800)" }}>{firma.referansSayisi}</strong> referans
                    </span>
                  </div>

                  {/* Aksiyonlar */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <Link
                      href={`/firma/${firma.id}`}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 10, textAlign: "center",
                        border: "1px solid var(--steel-200)", background: "white",
                        color: "var(--navy-700)", fontSize: "0.85rem", fontWeight: 600,
                        textDecoration: "none", transition: "all 0.2s",
                      }}
                    >
                      Profili Gör
                    </Link>
                    <button
                      onClick={() => paydasToggle(firma.id)}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 10,
                        border: "none",
                        background: secili
                          ? "rgba(16,185,129,0.1)"
                          : "linear-gradient(135deg, var(--navy-600), var(--navy-500))",
                        color: secili ? "var(--accent-green)" : "white",
                        fontSize: "0.85rem", fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      {secili ? (
                        <><Check size={16} /> Paydaş</>
                      ) : (
                        <><UserPlus size={16} /> Paydaş Ekle</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
