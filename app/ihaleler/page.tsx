/**
 * İhale Listeleri sayfası — Tüm aktif ihalelerin filtrelenebilir listesi.
 * Erişim kuralları:
 * - Giriş yapmamış ziyaretçiler: Erişim yok (giriş sayfasına yönlendirilir)
 * - Temel üyeler: Maskeli liste (firma adı ve proje adı blurlu)
 * - Uzman ve Çözüm Ortağı: Tam liste görüntüleme
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, MapPin, Clock, Building2, Filter, ChevronDown, Eye } from "lucide-react";

// Mock ihale verileri
const MOCK_IHALELER = [
  {
    id: "IHL-2026-001",
    project_name: "Ankara Merkez Ofis İnce İşler Taşeronluğu",
    firm_name: "Yılmaz Yapı Ltd. Şti.",
    kategori: "İnce İnşaat ve Dekorasyon",
    lokasyon: "Ankara",
    yayinTarihi: "2026-03-15",
    sonTarih: "2026-04-15",
    durum: "active" as const,
    sure: 90,
    goruntulenme: 142,
    teklifSayisi: 3,
  },
  {
    id: "IHL-2026-002",
    project_name: "İstanbul Kartal Rezidans Kaba Yapı",
    firm_name: "Doğan İnşaat A.Ş.",
    kategori: "Kaba Yapı Taşeronları",
    lokasyon: "İstanbul",
    yayinTarihi: "2026-03-10",
    sonTarih: "2026-04-20",
    durum: "active" as const,
    sure: 120,
    goruntulenme: 89,
    teklifSayisi: 5,
  },
  {
    id: "IHL-2026-003",
    project_name: "İzmir Bayraklı Çelik Konstrüksiyon",
    firm_name: "Ege Yapı Mühendislik",
    kategori: "Kaba Yapı Taşeronları",
    lokasyon: "İzmir",
    yayinTarihi: "2026-03-20",
    sonTarih: "2026-05-01",
    durum: "active" as const,
    sure: 60,
    goruntulenme: 56,
    teklifSayisi: 1,
  },
  {
    id: "IHL-2026-004",
    project_name: "Bursa Nilüfer Alçıpan ve Boya İşleri",
    firm_name: "Marmara Grup",
    kategori: "İnce İnşaat ve Dekorasyon",
    lokasyon: "Bursa",
    yayinTarihi: "2026-03-18",
    sonTarih: "2026-04-10",
    durum: "active" as const,
    sure: 45,
    goruntulenme: 210,
    teklifSayisi: 8,
  },
  {
    id: "IHL-2026-005",
    project_name: "Antalya Lara Havuz ve Peyzaj",
    firm_name: "Akdeniz Yapı Peyzaj",
    kategori: "Peyzaj ve Çevre Düzenleme",
    lokasyon: "Antalya",
    yayinTarihi: "2026-03-22",
    sonTarih: "2026-04-25",
    durum: "active" as const,
    sure: 75,
    goruntulenme: 34,
    teklifSayisi: 2,
  },
  {
    id: "IHL-2026-006",
    project_name: "Gaziantep Organize Sanayi Elektrik Tesisat",
    firm_name: "Güneydoğu Elektrik Müh.",
    kategori: "Mekanik, Elektrik ve Asansör",
    lokasyon: "Gaziantep",
    yayinTarihi: "2026-03-25",
    sonTarih: "2026-05-10",
    durum: "active" as const,
    sure: 100,
    goruntulenme: 67,
    teklifSayisi: 4,
  },
];

const KATEGORILER = [
  "Tümü",
  "Zemin ve Altyapı",
  "Kaba Yapı Taşeronları",
  "Dış Cephe ve Çatı",
  "İnce İnşaat ve Dekorasyon",
  "Mekanik, Elektrik ve Asansör",
  "Peyzaj ve Çevre Düzenleme",
  "Tamamlayıcı ve Yardımcı",
];

export default function IhalelerPage() {
  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState("Tümü");
  // TODO: Gerçek üyelik seviyesi kontrolü — şimdilik 1 (Temel) olarak simüle
  // 1: Temel (maskeli), 2: Uzman (tam), 3: Çözüm Ortağı (tam)
  const [uyelikSeviyesi] = useState(1);

  const temelUye = uyelikSeviyesi === 1;

  const filtrelenmisIhaleler = MOCK_IHALELER.filter(ihale => {
    const aramaUygun = arama === "" || 
      ihale.project_name.toLowerCase().includes(arama.toLowerCase()) ||
      ihale.lokasyon.toLowerCase().includes(arama.toLowerCase());
    const kategoriUygun = kategori === "Tümü" || ihale.kategori.includes(kategori);
    return aramaUygun && kategoriUygun;
  });

  const kalanGun = (tarih: string) => {
    const fark = new Date(tarih).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(fark / (1000 * 60 * 60 * 24)));
  };

  return (
    <DashboardLayout>
      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
          İhale Listesi
        </h1>
        <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
          {temelUye
            ? "Temel üyelikte ihale detayları maskeli görüntülenir. Tam erişim için planınızı yükseltin."
            : "Uzmanlık alanınıza göre aktif ihaleleri keşfedin ve teklif verin."}
        </p>
      </div>

      {/* Temel üye uyarısı */}
      {temelUye && (
        <div style={{
          background: "rgba(245, 158, 11, 0.06)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--navy-800)", marginBottom: 4 }}>
              Maskeli Görünüm Modu
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--steel-500)" }}>
              Temel üyelikte firma adı ve proje adı gizlenir. Detay görmek için planınızı yükseltin.
            </p>
          </div>
          <Link href="/abonelik" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
            Planı Yükselt
          </Link>
        </div>
      )}

      {/* Filtreler */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap",
      }}>
        {/* Arama */}
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
          <input
            type="text"
            placeholder="İhale veya şehir ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 42 }}
          />
        </div>

        {/* Kategori */}
        <div style={{ position: "relative", minWidth: 220 }}>
          <Filter size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 38, appearance: "none" }}
          >
            {KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Sonuç sayısı */}
      <p style={{ fontSize: "0.82rem", color: "var(--steel-400)", marginBottom: 16, fontWeight: 500 }}>
        {filtrelenmisIhaleler.length} ihale bulundu
      </p>

      {/* İhale Kartları */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtrelenmisIhaleler.map((ihale) => (
          <div key={ihale.id} style={{
            background: "white",
            border: "1px solid var(--steel-200)",
            borderRadius: 16,
            padding: "24px 28px",
            transition: "all 0.2s",
            cursor: temelUye ? "default" : "pointer",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--steel-300)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--steel-200)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                {/* Üst bilgi */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span className="badge badge-active">{ihale.durum === "active" ? "Aktif" : ihale.durum}</span>
                  <span style={{ color: "var(--steel-400)", fontSize: "0.8rem", fontWeight: 500 }}>{ihale.id}</span>
                </div>

                {/* Proje adı */}
                <h3 style={{
                  fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8,
                }}>
                  {temelUye ? (
                    <span className="blur-mask">{ihale.project_name}</span>
                  ) : (
                    <Link href={`/ihale/${ihale.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {ihale.project_name}
                    </Link>
                  )}
                </h3>

                {/* Firma adı */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <Building2 size={14} color="var(--steel-400)" />
                  <span style={{
                    fontSize: "0.88rem", color: "var(--steel-600)", fontWeight: 500,
                  }}>
                    {temelUye ? (
                      <span className="blur-mask">{ihale.firm_name}</span>
                    ) : (
                      ihale.firm_name
                    )}
                  </span>
                </div>

                {/* Meta bilgiler */}
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                    <MapPin size={14} /> {ihale.lokasyon}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                    <Clock size={14} /> {kalanGun(ihale.sonTarih)} gün kaldı
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", color: "var(--steel-500)" }}>
                    <Eye size={14} /> {ihale.goruntulenme} görüntülenme
                  </span>
                </div>
              </div>

              {/* Sağ taraf — Kategori ve Aksiyon */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 100,
                  background: "rgba(30,77,140,0.06)", color: "var(--navy-600)",
                  fontSize: "0.75rem", fontWeight: 600, marginBottom: 12,
                }}>
                  {ihale.kategori}
                </span>
                <br />
                {!temelUye && (
                  <Link
                    href={`/ihale/${ihale.id}`}
                    className="btn-primary"
                    style={{ padding: "8px 18px", fontSize: "0.82rem", textDecoration: "none" }}
                  >
                    Detay Gör
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
