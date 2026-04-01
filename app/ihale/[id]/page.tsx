"use client";

import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Building2, Download, CheckCircle2, AlertCircle, FileText, Send, Info, Share2, Eye, ShieldCheck } from "lucide-react";

export default function IhaleDetayPage({ params }: { params: { id: string } }) {
  const tenderId = params.id;

  // Mock data for demo purposes
  const tender = {
    id: tenderId,
    title: "Ankara Merkez Ofis İnce İşler Taşeronluğu",
    firm: "Yılmaz Yapı Ltd. Şti.",
    kategori: "İnce İşler",
    lokasyon: "Çankaya, Ankara",
    yayinTarihi: "21 Mart 2026",
    sonTarih: "15 Nisan 2026",
    durum: "Aktif",
    butce: "Belirtilmemiş",
    kapsam: `Projemiz kapsamında 2500 m2 kapalı alana sahip Ankara merkez ofisimizde ince işlerin (alçıpan, asma tavan, seramik, boya ve zemin kaplaması) yapılması için profesyonel taşeron firmalara ihtiyaç duyulmaktadır. 
    
İşin malzeme dahil veya hariç teklif edilebileceği teknik şartnamede belirtilmiştir.
Tüm iş güvenliği önlemleri yükleniciye ait olup, saha yönetimi merkez ofisimize ait olacaktır. Teminat şartı aranmaktadır.`,
    dosyalar: [
      { isim: "Teknik_Sartname_v2.pdf", boyut: "2.4 MB" },
      { isim: "Mimari_Projeler.zip", boyut: "45 MB" },
      { isim: "Birim_Fiyat_Tasarisi.xlsx", boyut: "135 KB" }
    ],
    goruntulenme: 142,
    teklifSayisi: 3,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--steel-50)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Üst Navigasyon */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <Link href="/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px",
            borderRadius: 12, background: "white", border: "1px solid var(--steel-200)", 
            color: "var(--steel-600)", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s", textDecoration: "none"
          }}>
            <ArrowLeft size={18} /> İhalelere Dön
          </Link>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
              borderRadius: 12, background: "white", border: "1px solid var(--steel-200)", 
              color: "var(--steel-600)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s"
            }}>
              <Share2 size={16} /> Paylaş
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 24px",
              borderRadius: 12, background: "var(--navy-600)", border: "none", 
              color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(30, 77, 140, 0.2)"
            }}
            onClick={() => alert("Teklif verme modülü yapılandırılıyor.")}>
              <Send size={16} /> Hızlı Teklif Ver
            </button>
          </div>
        </div>

        {/* Ana İçerik Bloğu */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24, alignItems: "start" }}>
          
          {/* Sol Kolon (Detaylar) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Başlık ve Özet */}
            <div style={{ background: "white", borderRadius: 24, padding: "40px", border: "1px solid var(--steel-200)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-green)", padding: "6px 14px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {tender.durum}
                </span>
                <span style={{ color: "var(--steel-500)", fontSize: "0.85rem", fontWeight: 600 }}>{tender.id}</span>
              </div>
              
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 20, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {tender.title}
              </h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, paddingTop: 20, borderTop: "1px solid var(--steel-100)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={18} color="var(--navy-500)" />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--steel-400)", fontWeight: 600 }}>İşveren Firma</span>
                    <span style={{ display: "block", fontSize: "0.9rem", color: "var(--navy-800)", fontWeight: 700 }}>{tender.firm}</span>
                  </div>
                </div>
                <div style={{ width: 1, background: "var(--steel-200)", margin: "0 8px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={18} color="var(--navy-500)" />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--steel-400)", fontWeight: 600 }}>Lokasyon</span>
                    <span style={{ display: "block", fontSize: "0.9rem", color: "var(--navy-800)", fontWeight: 700 }}>{tender.lokasyon}</span>
                  </div>
                </div>
                <div style={{ width: 1, background: "var(--steel-200)", margin: "0 8px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={18} color="var(--accent-orange)" />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--steel-400)", fontWeight: 600 }}>Son Başvuru</span>
                    <span style={{ display: "block", fontSize: "0.9rem", color: "var(--navy-800)", fontWeight: 700 }}>{tender.sonTarih}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Şartname ve Kapsam */}
            <div style={{ background: "white", borderRadius: 24, padding: "40px", border: "1px solid var(--steel-200)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={20} color="var(--navy-500)" /> İş Kapsamı ve Özet Şartname
              </h2>
              <div style={{ color: "var(--steel-700)", fontSize: "0.95rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {tender.kapsam}
              </div>
            </div>

            {/* Dosyalar */}
            <div style={{ background: "white", borderRadius: 24, padding: "40px", border: "1px solid var(--steel-200)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <Download size={20} color="var(--navy-500)" /> Ekli Belgeler
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tender.dosyalar.map((doc, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", alignItems: "center", justifyContent: "space-between", 
                    padding: "16px 20px", borderRadius: 12, border: "1px solid var(--steel-200)",
                    background: "var(--steel-50)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy-500)", border: "1px solid var(--steel-200)" }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--navy-800)" }}>{doc.isim}</span>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--steel-400)", fontWeight: 500 }}>{doc.boyut}</span>
                      </div>
                    </div>
                    <button style={{ 
                      padding: "8px 16px", background: "white", border: "1px solid var(--navy-300)", 
                      color: "var(--navy-600)", fontWeight: 600, fontSize: "0.8rem", borderRadius: 8, cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--steel-50)"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                    onClick={() => alert("Dosya iniyor...")}
                    >
                      İndir
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sağ Kolon (Bilanço/Durum Kartı) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 24 }}>
            
            {/* Teklif Kartı */}
            <div style={{ background: "white", borderRadius: 24, padding: "32px", border: "1px solid var(--steel-200)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)" }}>
              <div style={{ marginBottom: 24 }}>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--steel-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Yaklaşık Toplam Bütçe</span>
                <span style={{ display: "block", fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)" }}>{tender.butce}</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "var(--steel-600)", fontWeight: 500 }}>
                  <Eye size={16} color="var(--navy-400)" /> {tender.goruntulenme} Görüntülenme
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "var(--steel-600)", fontWeight: 500 }}>
                  <Send size={16} color="var(--accent-green)" /> {tender.teklifSayisi} Teklif Verildi
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem", color: "var(--steel-600)", fontWeight: 500 }}>
                  <CheckCircle2 size={16} color="var(--navy-400)" /> Teminat Gereklidir
                </div>
              </div>

              <button style={{
                width: "100%", padding: "14px 0", borderRadius: 12, background: "var(--navy-600)", 
                border: "none", color: "white", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 20px -6px rgba(30, 77, 140, 0.4)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              onClick={() => alert("Teklif verme ekranı başlatılıyor...")}
              >
                Teklif Hazırla
              </button>
            </div>

            {/* Firma Güven Kartı */}
            <div style={{ background: "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-600) 100%)", borderRadius: 24, padding: "28px", color: "white", boxShadow: "0 10px 30px -15px rgba(30,77,140,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <ShieldCheck size={28} color="var(--accent-green)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Onaylı Tasarım</h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
                Bu işverenin belgeleri, ticaret sicil gazetesi ve vergi levhası İnşaat Duvarı uzmanları tarafından doğrulanmıştır.
              </p>
              <Link href={`/firma/firma-001`} style={{ display: "block", width: "100%", padding: "10px 0", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", textAlign: "center", textDecoration: "none" }}
              >
                Firma Profilini Gör
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
