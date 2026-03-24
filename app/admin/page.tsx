/**
 * Admin Dashboard — Platform Yönetim Paneli.
 * Firmaların doğrulanması, ihalelerin denetimi ve sistem istatistikleri.
 */
"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, FileStack, TrendingUp, 
  LogOut, Search, Filter, LineChart, Database, LogIn, Settings2, AlertCircle, Save
} from "lucide-react";
import Link from "next/link";



const TUM_FIRMALAR: any[] = [];
const TUM_IHALELER: any[] = [];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("genel");
  const [yonetilenFirma, setYonetilenFirma] = useState<number | null>(null);

  // Demo state for simulation
  const [firmalar, setFirmalar] = useState(TUM_FIRMALAR);
  const [seciliDurum, setSeciliDurum] = useState("Aktif");
  const [seciliNot, setSeciliNot] = useState("");

  useEffect(() => {
    // LocalStorage üzerinden simüle edilen yeni kayıtları al ve tabloya ekle
    const yeniKayitlar = JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]");
    if (yeniKayitlar.length > 0) {
      setFirmalar(prev => {
        const mevcutIds = new Set(prev.map(f => f.id));
        const eklenecekler = yeniKayitlar.filter((yf: any) => !mevcutIds.has(yf.id));
        return [...prev, ...eklenecekler];
      });
    }
  }, []);

  const acFirmaYonetimi = (firma: any) => {
    if (yonetilenFirma === firma.id) {
      setYonetilenFirma(null);
    } else {
      setYonetilenFirma(firma.id);
      setSeciliDurum(firma.durum);
      setSeciliNot(firma.not || "");
    }
  };

  const kaydetMudurum = (firmaId: number) => {
    if (seciliDurum === "Pasif" && !seciliNot.trim()) {
      alert("Lütfen firmayı pasife alma nedeninizi (Açıklama / Not) giriniz.");
      return;
    }
    setFirmalar(prev => prev.map(f => f.id === firmaId ? { ...f, durum: seciliDurum, not: seciliNot } : f));
    setYonetilenFirma(null); // Kapat
    alert("Firma durumu başarıyla güncellendi!");
  };

  const onayBekleyenler = firmalar.filter(f => f.durum === "Onay Bekliyor");

  const statsData = [
    { label: "Kayıtlı Firma", value: firmalar.length.toString(), icon: Users, color: "#3B82F6", trend: "+12%" },
    { label: "Toplam İhaleler", value: TUM_IHALELER.length.toString(), icon: FileStack, color: "#8B5CF6", trend: "+8%" },
    { label: "Aktif İhale", value: TUM_IHALELER.filter(i => i.durum === "Aktif").length.toString(), icon: TrendingUp, color: "#10B981", trend: "+5%" },
    { label: "Onay Bekleyen", value: onayBekleyenler.length.toString(), icon: ShieldCheck, color: "#F59E0B", trend: "-2%" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F1113", color: "#E2E8F0" }}>
      
      {/* Admin Sidebar */}
      <aside style={{
        width: 280, background: "#16191D", borderRight: "1px solid #2D3748",
        padding: "24px", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh"
      }}>
        {/* Main Logo & Link */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, padding: "0 8px", textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg, #1E4D8C, #2E6AB4)",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>
            </svg>
          </div>
          <div>
            <span style={{ display: "block", color: "white", fontSize: "1.15rem", fontWeight: 800 }}>İnşaat Duvarı</span>
            <span style={{ display: "block", color: "#EF4444", fontSize: "0.7rem", fontWeight: 700 }}>ADMIN PANELİ</span>
          </div>
        </Link>

        {/* Admin Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <AdminNavItem icon={LineChart} label="Genel Bakış" active={activeTab === "genel"} onClick={() => setActiveTab("genel")} />
          <AdminNavItem icon={Users} label="Firma Listesi" active={activeTab === "firmalar"} onClick={() => { setActiveTab("firmalar"); setYonetilenFirma(null); }} />
          <AdminNavItem icon={FileStack} label="İhaleler" active={activeTab === "ihaleler"} onClick={() => setActiveTab("ihaleler")} />
          <AdminNavItem icon={Database} label="İşlem Logları" active={activeTab === "logs"} onClick={() => setActiveTab("logs")} />
        </nav>

        {/* Admin Footer */}
        <div style={{ borderTop: "1px solid #2D3748", paddingTop: 20 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
            background: "transparent", border: "none", color: "#A0AEC0", cursor: "pointer", fontSize: "0.9rem"
          }}>
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main style={{ flex: 1, padding: "40px 48px" }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "white" }}>
              {activeTab === "firmalar" ? "Tüm Firmalar" : 
               activeTab === "ihaleler" ? "Sistemdeki İhaleler" : "Sistem Özeti"}
            </h1>
            <p style={{ color: "#718096" }}>
              {activeTab === "firmalar" ? "Platforma kayıtlı tüm şirketler ve üyelik detayları." : 
               activeTab === "ihaleler" ? "Platformda yayınlanan tüm aktif ve geçmiş ihaleler." : "Platform genelindeki kritik veriler."}
            </p>
          </div>
        </header>

        {activeTab === "genel" && (
          <>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 40 }}>
              {statsData.map((stat, i) => (
                <div key={i} style={{ background: "#16191D", border: "1px solid #2D3748", padding: "24px", borderRadius: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ color: stat.color }}><stat.icon size={24} /></div>
                    <span style={{ color: stat.trend.startsWith("+") ? "#10B981" : "#EF4444", fontSize: "0.75rem", fontWeight: 700 }}>{stat.trend}</span>
                  </div>
                  <h3 style={{ color: "#718096", fontSize: "0.8rem", fontWeight: 600 }}>{stat.label}</h3>
                  <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 800 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
               <section style={{ background: "#16191D", border: "1px solid #2D3748", borderRadius: 24, padding: "28px" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: 20 }}>Onay Bekleyen Firmalar</h2>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {onayBekleyenler.length === 0 ? (
                        <tr><td style={{ padding: "12px 0", color: "#A0AEC0", fontSize: "0.9rem" }}>Onay bekleyen firma yok.</td></tr>
                      ) : (
                        onayBekleyenler.map(f => (
                          <tr key={f.id} style={{ borderBottom: "1px solid #232931" }}>
                            <td style={{ padding: "12px 0", color: "#A0AEC0", fontSize: "0.85rem" }}>#{f.id}</td>
                            <td style={{ padding: "12px 0", color: "white", fontWeight: 600 }}>{f.ad}</td>
                            <td style={{ textAlign: "right" }}>
                              <button onClick={() => {
                                setFirmalar(prev => prev.map((firma: any) => firma.id === f.id ? { ...firma, durum: "Aktif" } : firma));
                                alert(f.ad + " firması onaylandı!");
                              }} style={{ background: "#10B981", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>Onayla</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
               </section>
               <section style={{ background: "#16191D", border: "1px solid #2D3748", borderRadius: 24, padding: "28px" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: 20 }}>Sistem Durumu</h2>
                  <HealthItem label="Sunucu" status="Aktif" color="#10B981" />
                  <HealthItem label="Veritabanı" status="Aktif" color="#10B981" />
                  <HealthItem label="Depolama" status="Aktif" color="#10B981" />
               </section>
            </div>
          </>
        )}

        {activeTab === "firmalar" && (
          <section style={{ background: "#16191D", border: "1px solid #2D3748", borderRadius: 24, padding: "32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2D3748" }}>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096" }}>Firma Adı</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096" }}>Üyelik</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096" }}>Durum</th>
                  <th style={{ textAlign: "right", padding: "16px", color: "#718096" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {firmalar.map((firma: any) => (
                  <React.Fragment key={firma.id}>
                    <tr style={{ borderBottom: yonetilenFirma === firma.id ? "none" : "1px solid #232931" }}>
                      <td style={{ padding: "16px", color: "#A0AEC0", fontSize: "0.85rem" }}>#{firma.id}</td>
                      <td style={{ padding: "16px", color: "white", fontWeight: 600 }}>{firma.ad}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700,
                          background: firma.uyelik === "Premium" ? "rgba(139, 92, 246, 0.15)" : (firma.uyelik === "Standart" ? "rgba(59, 130, 246, 0.15)" : "rgba(113, 128, 150, 0.15)"),
                          color: firma.uyelik === "Premium" ? "#A78BFA" : (firma.uyelik === "Standart" ? "#60A5FA" : "#A0AEC0")
                        }}>
                          {firma.uyelik}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: firma.durum === "Aktif" ? "#10B981" : (firma.durum === "Pasif" ? "#EF4444" : "#F59E0B") }} />
                          <span style={{ fontSize: "0.85rem", color: firma.durum === "Pasif" ? "#EF4444" : "" }}>{firma.durum}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <button 
                            onClick={() => window.location.href = "/dashboard"}
                            style={{ 
                              background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
                              color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                              fontSize: "0.85rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8
                            }}
                          >
                            <LogIn size={14} /> Firmaya Gir
                          </button>
                          <button 
                            onClick={() => acFirmaYonetimi(firma)}
                            style={{ 
                              background: yonetilenFirma === firma.id ? "rgba(239, 68, 68, 0.15)" : "transparent",
                              border: yonetilenFirma === firma.id ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #2D3748",
                              color: yonetilenFirma === firma.id ? "#EF4444" : "#A0AEC0",
                              padding: "8px 16px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                              fontSize: "0.85rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8
                            }}
                          >
                            <Settings2 size={14} /> {yonetilenFirma === firma.id ? "Kapat" : "Yönet"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Hızlı Yönetim Paneli */}
                    {yonetilenFirma === firma.id && (
                      <tr style={{ background: "#111417", borderBottom: "1px solid #232931" }}>
                        <td colSpan={5} style={{ padding: "0 16px 20px 16px" }}>
                          <div style={{ 
                            border: "1px dashed #2D3748", borderRadius: 12, padding: "20px", display: "flex", gap: 24,
                            borderLeft: "4px solid #EF4444"
                          }}>
                            {/* Durum Seçimi */}
                            <div style={{ flex: 1 }}>
                              <label style={{ display: "block", color: "#A0AEC0", fontSize: "0.8rem", marginBottom: 8, fontWeight: 600 }}>Firma Durumu</label>
                              <select 
                                value={seciliDurum}
                                onChange={(e) => setSeciliDurum(e.target.value)}
                                style={{ 
                                  width: "100%", padding: "10px 14px", background: "#1A202C", 
                                  border: "1px solid #2D3748", borderRadius: 8, color: "white", outline: "none"
                                }}
                              >
                                <option value="Aktif">Aktif (Sorunsuz)</option>
                                <option value="Onay Bekliyor">Onay Bekliyor (Kısıtlı)</option>
                                <option value="Pasif">Pasif (Askıya Alınmış)</option>
                              </select>
                            </div>
                            
                            {/* Not / Açıklama */}
                            <div style={{ flex: 2 }}>
                              <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#A0AEC0", fontSize: "0.8rem", marginBottom: 8, fontWeight: 600 }}>
                                <AlertCircle size={14} /> Neden Belirtin (Açıklama / Not)
                              </label>
                              <input 
                                type="text"
                                placeholder="Örn: Sahte evrak tespit edildi, şikayet vs."
                                value={seciliNot}
                                onChange={(e) => setSeciliNot(e.target.value)}
                                style={{ 
                                  width: "100%", padding: "10px 14px", background: "#1A202C", 
                                  border: "1px solid #2D3748", borderRadius: 8, color: "white", outline: "none"
                                }}
                              />
                            </div>
                            
                            {/* Kaydet */}
                            <div style={{ display: "flex", alignItems: "flex-end" }}>
                              <button 
                                onClick={() => kaydetMudurum(firma.id)}
                                style={{ 
                                  background: "#3B82F6", color: "white", padding: "10px 24px", 
                                  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
                                  display: "flex", alignItems: "center", gap: 8, height: 38
                                }}
                              >
                                <Save size={16} /> Durumu Kaydet
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "ihaleler" && (
          <section style={{ background: "#16191D", border: "1px solid #2D3748", borderRadius: 24, padding: "32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2D3748" }}>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096", fontSize: "0.85rem" }}>İhale ID</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096", fontSize: "0.85rem" }}>Başlık</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096", fontSize: "0.85rem", width: "20%" }}>Firma</th>
                  <th style={{ textAlign: "left", padding: "16px", color: "#718096", fontSize: "0.85rem" }}>Durum / Bitiş</th>
                  <th style={{ textAlign: "right", padding: "16px", color: "#718096", fontSize: "0.85rem" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {TUM_IHALELER.map((ihale) => (
                  <tr key={ihale.id} style={{ borderBottom: "1px solid #232931" }}>
                    <td style={{ padding: "16px", color: "#A0AEC0", fontSize: "0.85rem" }}>{ihale.id}</td>
                    <td style={{ padding: "16px", color: "white", fontWeight: 600 }}>{ihale.baslik}</td>
                    <td style={{ padding: "16px", color: "#A0AEC0", fontSize: "0.85rem" }}>{ihale.firma}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ 
                          width: "fit-content", padding: "2px 8px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700,
                          background: ihale.durum === "Aktif" ? "rgba(16, 185, 129, 0.15)" : (ihale.durum === "Değerlendirmede" ? "rgba(245, 158, 11, 0.15)" : "rgba(113, 128, 150, 0.15)"),
                          color: ihale.durum === "Aktif" ? "#10B981" : (ihale.durum === "Değerlendirmede" ? "#F59E0B" : "#A0AEC0")
                        }}>
                          {ihale.durum}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#718096" }}>Son: {ihale.bitis}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <button 
                        onClick={() => alert("İhale detay sayfası modülü hazırlanıyor.")}
                        style={{ background: "transparent", border: "1px solid #2D3748", color: "white", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}
                      >
                        Detayı Gör
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}


function AdminNavItem({ icon: Icon, label, active, onClick }: { 
  icon: any, label: string, active: boolean, onClick: () => void 
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
      background: active ? "rgba(220, 38, 38, 0.08)" : "transparent",
      border: "none", color: active ? "white" : "#718096", cursor: "pointer",
      fontSize: "0.95rem", fontWeight: active ? 600 : 500, transition: "all 0.2s",
      width: "100%", textAlign: "left"
    }}>
      <Icon size={18} style={{ color: active ? "#EF4444" : "inherit" }} />
      {label}
    </button>
  );
}

function HealthItem({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ color: "#A0AEC0", fontSize: "0.9rem" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>{status}</span>
      </div>
    </div>
  );
}
