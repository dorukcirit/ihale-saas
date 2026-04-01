/**
 * Firma Profil Bilgi sayfası — Herkese açık (üye) firma profili görünümü.
 * Firma adı, logo, doğrulama durumu, yetkinlikler, referanslar ve iletişim bilgileri.
 */
"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft, Building2, MapPin, Mail, Phone, Globe,
  BadgeCheck, ShieldCheck, Star, Briefcase, Calendar,
  ExternalLink
} from "lucide-react";

// Mock firma verisi
const MOCK_FIRMA = {
  id: "firma-001",
  name: "Yılmaz Yapı Ltd. Şti.",
  authorized_person: "Ahmet Yılmaz",
  address: "Ankara, Türkiye",
  email: "info@yilmazyapi.com.tr",
  phone: "0312 222 33 44",
  show_phone: true,
  show_email: true,
  website: "https://yilmazyapi.com.tr",
  membership_type: 3,
  has_blue_tick: true,
  yetkinlikler: [
    "İnce İnşaat ve Dekorasyon Taşeronları (İç Mekan)",
    "Kaba Yapı Taşeronları",
    "Tamamlayıcı ve Yardımcı Taşeronlar",
  ],
  referanslar: [
    {
      employer: "ABC Holding",
      project_name: "İstanbul Maslak Kule Projesi",
      project_location: "İstanbul",
      project_date: "2025-06-15",
      scope: "İnce işler (alçıpan, boya, zemin kaplama)",
    },
    {
      employer: "Devlet Hastaneleri Genel Müdürlüğü",
      project_name: "Ankara Şehir Hastanesi Ek Bina",
      project_location: "Ankara",
      project_date: "2024-03-10",
      scope: "Kaba yapı ve dış cephe izolasyon",
    },
  ],
  kayitTarihi: "2025-08-20",
  aktifIhaleSayisi: 4,
};

const TIER_LABELS: Record<number, { ad: string; renk: string; arkaplan: string }> = {
  1: { ad: "Temel Üye", renk: "var(--steel-600)", arkaplan: "var(--steel-100)" },
  2: { ad: "Uzman Üye", renk: "var(--navy-600)", arkaplan: "rgba(30,77,140,0.08)" },
  3: { ad: "Çözüm Ortağı", renk: "#B8860B", arkaplan: "rgba(184,134,11,0.08)" },
};

export default function FirmaProfilPage({ params }: { params: { id: string } }) {
  const firma = MOCK_FIRMA; // Gerçek API ile değiştirilecek
  const tier = TIER_LABELS[firma.membership_type] || TIER_LABELS[1];

  return (
    <main>
      <Navbar />

      <div style={{ paddingTop: 100, minHeight: "100vh", background: "var(--steel-50)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Geri Butonu */}
          <Link href="/paydaslar" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px",
            borderRadius: 12, background: "white", border: "1px solid var(--steel-200)",
            color: "var(--steel-600)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
            marginBottom: 28, transition: "all 0.2s",
          }}>
            <ArrowLeft size={18} /> Paydaşlara Dön
          </Link>

          {/* Profil Başlık Kartı */}
          <div style={{
            background: "white", borderRadius: 24, padding: "40px",
            border: "1px solid var(--steel-200)",
            boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)",
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: "linear-gradient(135deg, var(--navy-600), var(--navy-400))",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Building2 size={36} color="white" />
              </div>

              <div style={{ flex: 1 }}>
                {/* Firma Adı + Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)", letterSpacing: "-0.02em" }}>
                    {firma.name}
                  </h1>
                  {firma.has_blue_tick && (
                    <BadgeCheck size={24} color="var(--accent-blue)" />
                  )}
                  <span style={{
                    padding: "4px 14px", borderRadius: 100,
                    background: tier.arkaplan, color: tier.renk,
                    fontSize: "0.75rem", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {tier.ad}
                  </span>
                </div>

                {/* Meta bilgiler */}
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--steel-600)" }}>
                    <MapPin size={16} color="var(--steel-400)" /> {firma.address}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--steel-600)" }}>
                    <Calendar size={16} color="var(--steel-400)" /> Üyelik: {new Date(firma.kayitTarihi).toLocaleDateString("tr-TR")}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--steel-600)" }}>
                    <Briefcase size={16} color="var(--steel-400)" /> {firma.aktifIhaleSayisi} aktif ihale
                  </span>
                </div>

                {/* İletişim */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {firma.show_email && (
                    <a href={`mailto:${firma.email}`} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid var(--steel-200)", background: "white",
                      color: "var(--navy-700)", fontSize: "0.82rem", fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      <Mail size={14} /> {firma.email}
                    </a>
                  )}
                  {firma.show_phone && (
                    <a href={`tel:${firma.phone}`} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid var(--steel-200)", background: "white",
                      color: "var(--navy-700)", fontSize: "0.82rem", fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      <Phone size={14} /> {firma.phone}
                    </a>
                  )}
                  {firma.website && (
                    <a href={firma.website} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid var(--steel-200)", background: "white",
                      color: "var(--navy-700)", fontSize: "0.82rem", fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      <Globe size={14} /> Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* İçerik Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>

            {/* Sol — Referanslar */}
            <div style={{
              background: "white", borderRadius: 24, padding: "36px",
              border: "1px solid var(--steel-200)",
            }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <Briefcase size={20} color="var(--navy-500)" /> İş Referansları
              </h2>

              {firma.referanslar.length === 0 ? (
                <p style={{ color: "var(--steel-400)", fontSize: "0.9rem", textAlign: "center", padding: "32px 0" }}>
                  Henüz referans eklenmemiş.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {firma.referanslar.map((ref, idx) => (
                    <div key={idx} style={{
                      border: "1px solid var(--steel-200)", borderRadius: 14,
                      padding: "20px", background: "var(--steel-50)",
                    }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 8 }}>
                        {ref.employer}
                      </h4>
                      <p style={{ fontSize: "0.9rem", color: "var(--steel-600)", marginBottom: 12 }}>
                        {ref.project_name} — {ref.scope}
                      </p>
                      <div style={{ display: "flex", gap: 16 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--steel-400)" }}>
                          <Calendar size={13} /> {new Date(ref.project_date).getFullYear()}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--steel-400)" }}>
                          <MapPin size={13} /> {ref.project_location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ — Yetkinlikler + Güven */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Yetkinlikler */}
              <div style={{
                background: "white", borderRadius: 24, padding: "28px",
                border: "1px solid var(--steel-200)",
              }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Star size={18} color="var(--navy-500)" /> Yetkinlik Alanları
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {firma.yetkinlikler.map((yet, idx) => (
                    <div key={idx} style={{
                      padding: "10px 14px", borderRadius: 10,
                      background: "var(--steel-50)", border: "1px solid var(--steel-200)",
                      fontSize: "0.85rem", fontWeight: 500, color: "var(--navy-700)",
                    }}>
                      {yet}
                    </div>
                  ))}
                </div>
              </div>

              {/* Güven Kartı */}
              <div style={{
                background: "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-600) 100%)",
                borderRadius: 24, padding: "28px", color: "white",
                boxShadow: "0 10px 30px -15px rgba(30,77,140,0.3)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <ShieldCheck size={28} color="var(--accent-green)" />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Doğrulanmış Firma</h3>
                </div>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  Bu firmanın belgeleri, ticaret sicil gazetesi ve vergi levhası
                  İnşaat Duvarı uzmanları tarafından doğrulanmıştır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
