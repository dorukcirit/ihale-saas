/**
 * Panel 3: Firma Paneli.
 * - Banka bilgileri kaldırıldı.
 * - Abonelik durumu "Üye" olarak gösteriliyor.
 * - Referanslar (iş deneyimleri) görüntüleniyor.
 * - Firma bilgileri localStorage'daki gerçek kayıt verisinden okunuyor.
 * - Cep telefonu gizli (KVKK), şirket telefonu görünürlük toggle'lı.
 */
"use client";

import { useState, useEffect } from "react";
import { 
  Building, Hash, User, Mail, Phone, Smartphone, 
  Shield, AlertTriangle, Save, Eye, EyeOff, 
  Briefcase, MapPin, Calendar, BadgeCheck 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Referans {
  employer: string;
  project_name: string;
  project_date: string;
  project_location: string;
  scope: string;
}

interface FirmaVeri {
  name: string;
  tax_number: string;
  authorized_person: string;
  email: string;
  kayit_telefonu: string;
  sirket_telefonu: string;
  telefon_gorunur: boolean;
  membership_type: number;
}

const BOŞ_FIRMA: FirmaVeri = {
  name: "Yükleniyor...",
  tax_number: "",
  authorized_person: "",
  email: "",
  kayit_telefonu: "",
  sirket_telefonu: "",
  telefon_gorunur: false,
  membership_type: 1,
};

export default function CompanyPanel() {
  const [firma, setFirma] = useState<FirmaVeri>(BOŞ_FIRMA);
  const [referanslar, setReferanslar] = useState<Referans[]>([]);
  const [loading, setLoading] = useState(true);
  const [hassasUyari, setHassasUyari] = useState(false);
  const [degisiklikAlan, setDegisiklikAlan] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Firma Bilgilerini Getir
        const { data: firmData, error: firmError } = await (supabase as any)
          .from("firms")
          .select("*")
          .eq("auth_user_id", user.id)
          .single();

        if (firmData && !firmError) {
          setFirma({
            name: firmData.name,
            tax_number: firmData.tax_number,
            authorized_person: firmData.authorized_person,
            email: firmData.email,
            kayit_telefonu: firmData.phone,
            sirket_telefonu: firmData.phone,
            telefon_gorunur: firmData.show_phone,
            membership_type: firmData.membership_type,
          });

          const { data: refData, error: refError } = await (supabase as any)
            .from("firm_references")
            .select("*")
            .eq("firm_id", firmData.id);

          if (refData && !refError) {
            setReferanslar(refData);
          }
        } else {
          loadFromLocal();
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        loadFromLocal();
      } finally {
        setLoading(false);
      }
    }

    function loadFromLocal() {
      try {
        const kayitlar = JSON.parse(localStorage.getItem("yeni_kayitlar") || "[]");
        if (kayitlar.length > 0) {
          const son = kayitlar[kayitlar.length - 1];
          const f = son?.detay?.firma || {};
          setFirma({
            name: f.name || "Test Firma A.Ş.",
            tax_number: f.tax_number || "1111111111",
            authorized_person: f.authorized_person || "Yetkili",
            email: f.email || "info@test.com",
            kayit_telefonu: f.kayit_telefonu || f.phone || "05551234567",
            sirket_telefonu: f.sirket_telefonu || "02121234567",
            telefon_gorunur: f.telefon_gorünur ?? true,
            membership_type: son.uyelik === "Premium" ? 3 : (son.uyelik === "Standart" ? 2 : 1),
          });
          
          if (son?.detay?.references) {
            setReferanslar(son.detay.references.map((r: any) => ({
              employer: r.employer,
              project_name: r.subject || r.project_name,
              project_date: r.year ? `${r.year}-01-01` : r.project_date,
              project_location: r.location || r.project_location,
              scope: r.scope || ""
            })));
          }
        } else {
          // Hiç kayıt yoksa
          setFirma({ ...BOŞ_FIRMA, name: "Kayıtlı Firma Bulunamadı" });
        }
      } catch (e) {
        setFirma({ ...BOŞ_FIRMA, name: "Yerel Veri Hatası" });
      }
    }

    verileriGetir();
  }, [supabase.auth]);


  const hassasAlanlar = ["tax_number"];

  const handleChange = (alan: string, deger: string) => {
    if (hassasAlanlar.includes(alan)) {
      setDegisiklikAlan("Vergi Numarası");
      setHassasUyari(true);
      return;
    }
    setFirma(prev => ({ ...prev, [alan]: deger }));
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>Veriler yükleniyor...</p>
      </div>
    );
  }

  const TIER_LABELS: Record<number, string> = {
    1: "TEMEL",
    2: "UZMAN",
    3: "ÇÖZÜM ORTAĞI"
  };

  const TIER_NAMES: Record<number, string> = {
    1: "Temel Üye",
    2: "Uzman Üye",
    3: "Çözüm Ortağı"
  };

  return (
    <div>
      {/* Hassas değişiklik uyarısı */}
      {hassasUyari && (
        <div style={{
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 12, padding: 20, marginBottom: 24,
          display: "flex", alignItems: "flex-start", gap: 14,
        }}>
          <AlertTriangle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--navy-900)", marginBottom: 4 }}>
              Hassas Bilgi Değişikliği
            </h4>
            <p style={{ color: "var(--steel-700)", fontSize: "0.85rem", marginBottom: 12 }}>
              <strong>{degisiklikAlan}</strong> değişikliği için OTP doğrulaması gereklidir.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.82rem" }}>
                OTP Gönder
              </button>
              <button
                onClick={() => setHassasUyari(false)}
                style={{
                  padding: "8px 18px", borderRadius: 8,
                  border: "1px solid var(--steel-200)", background: "var(--white)",
                  cursor: "pointer", fontSize: "0.82rem", color: "var(--steel-600)"
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Sol: Firma Bilgileri */}
        <div className="card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Building size={18} color="var(--navy-500)" /> Firma Bilgileri
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "name",              label: "Firma Adı",      icon: Building, value: firma.name              },
              { key: "tax_number",        label: "Vergi Numarası", icon: Hash,     value: firma.tax_number,       hassas: true },
              { key: "authorized_person", label: "Yetkili Kişi",   icon: User,     value: firma.authorized_person },
              { key: "email",             label: "E-posta",         icon: Mail,     value: firma.email             },
            ].map((alan) => (
              <div key={alan.key}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {alan.label}
                  {alan.hassas && <Shield size={12} color="var(--accent-amber)" />}
                </label>
                <div style={{ position: "relative" }}>
                  <alan.icon size={15} style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    color: "var(--steel-400)"
                  }} />
                  <input
                    className="form-input"
                    value={alan.value}
                    onChange={(e) => handleChange(alan.key, e.target.value)}
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>
            ))}

            {/* Cep Telefonu — salt okunur, gizli (KVKK) */}
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Smartphone size={13} style={{ color: "var(--steel-400)" }} />
                Cep Telefonu
                <span style={{
                  fontSize: "0.72rem", background: "var(--steel-100)",
                  color: "var(--steel-500)", padding: "1px 7px", borderRadius: 9999, fontWeight: 500
                }}>Gizli — KVKK</span>
              </label>
              <div style={{ position: "relative" }}>
                <Smartphone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--steel-300)" }} />
                <input
                  className="form-input"
                  value={firma.kayit_telefonu.replace(/./g, "•")}
                  readOnly
                  style={{ paddingLeft: 38, color: "var(--steel-400)", cursor: "not-allowed", background: "var(--steel-100)" }}
                />
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--steel-400)", marginTop: 4 }}>
                Gizlilik nedeniyle görüntülenemiyor. Değiştirmek için destek hattınızı arayın.
              </p>
            </div>

            {/* Şirket Telefonu + Görünürlük Toggle */}
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={13} style={{ color: "var(--steel-400)" }} />
                  Şirket Telefonu
                </span>
                <button
                  type="button"
                  onClick={() => setFirma(prev => ({ ...prev, telefon_gorunur: !prev.telefon_gorunur }))}
                  title={firma.telefon_gorunur ? "Profilde görünüyor — gizlemek için tıklayın" : "Gizli — göstermek için tıklayın"}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: firma.telefon_gorunur ? "rgba(16,185,129,0.1)" : "var(--steel-100)",
                    border: `1px solid ${firma.telefon_gorunur ? "rgba(16,185,129,0.3)" : "var(--steel-200)"}`,
                    borderRadius: 9999, padding: "3px 10px 3px 6px",
                    cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
                    color: firma.telefon_gorunur ? "var(--accent-green)" : "var(--steel-500)",
                    transition: "all 0.2s",
                  }}
                >
                  {firma.telefon_gorunur
                    ? <><Eye size={11} /> Profilden Görünüyor</>
                    : <><EyeOff size={11} /> Gizli</>}
                </button>
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
                <input
                  className="form-input"
                  value={firma.sirket_telefonu}
                  onChange={(e) => handleChange("sirket_telefonu", e.target.value)}
                  style={{ paddingLeft: 38 }}
                  placeholder="Firma sabit telefonu"
                />
              </div>
              {!firma.telefon_gorunur && (
                <p style={{ fontSize: "0.72rem", color: "var(--steel-500)", marginTop: 4 }}>
                  Bu numara profilinizde gizleniyor.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sağ: Üyelik Durumu + Referanslar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Üyelik Durumu */}
          <div className="card">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <BadgeCheck size={18} color="var(--navy-500)" /> Üyelik Durumu
            </h3>
            <div style={{
              padding: 16, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(30,77,140,0.05), rgba(46,106,180,0.08))",
              border: "1px solid rgba(30,77,140,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: "0.85rem", color: "var(--steel-700)" }}>Mevcut Plan</span>
                <span className="badge" style={{
                  background: firma.membership_type === 3 ? "rgba(30,77,140,0.1)" : "rgba(245,158,11,0.1)", 
                  color: firma.membership_type === 3 ? "var(--navy-600)" : "var(--accent-amber)",
                  fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px",
                }}>{TIER_LABELS[firma.membership_type] || "TEMEL"}</span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 6 }}>
                {TIER_NAMES[firma.membership_type] || "Temel Üye"}
              </h4>
              <p style={{ color: "var(--steel-500)", fontSize: "0.82rem", marginBottom: 12 }}>
                İhaleleri görüntülemek için hesabınızın onaylanması gerekiyor.
              </p>
              <button className="btn-primary" style={{ width: "100%", padding: "10px", fontSize: "0.85rem" }}>
                Planı Yükselt
              </button>
            </div>
          </div>

          {/* Referanslar */}
          <div className="card">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Briefcase size={18} color="var(--navy-500)" /> İş Referansları
            </h3>

            {referanslar.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "24px 16px",
                border: "1px dashed var(--steel-200)", borderRadius: 10,
                color: "var(--steel-400)", fontSize: "0.85rem",
              }}>
                Henüz referans eklenmemiş.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {referanslar.map((ref, i) => (
                  <div key={i} style={{
                    border: "1px solid var(--steel-200)", borderRadius: 10,
                    padding: "14px 16px", background: "var(--steel-50)",
                  }}>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy-800)", marginBottom: 6 }}>
                      {ref.employer}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--steel-600)", marginBottom: 8 }}>
                      {ref.project_name} - {ref.scope}
                    </p>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--steel-400)" }}>
                        <Calendar size={11} /> {new Date(ref.project_date).getFullYear()}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--steel-400)" }}>
                        <MapPin size={11} /> {ref.project_location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kaydet */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" style={{ padding: "12px 28px" }}>
          <Save size={16} /> Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}
