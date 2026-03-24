/**
 * Panel 3: Firma Paneli.
 * Profil yönetimi, hassas değişikliklerde onay uyarısı.
 */
"use client";

import { useState } from "react";
import { Building, Hash, User, Mail, Phone, CreditCard, Shield, AlertTriangle, Save } from "lucide-react";

/** Demo firma verisi */
const DEMO_FIRMA = {
  name: "Yılmaz İnşaat A.Ş.",
  tax_number: "1234567890",
  authorized_person: "Ahmet Yılmaz",
  email: "info@yilmazinsaat.com",
  phone: "05321234567",
  iban: "TR33 0006 1005 1978 6457 8413 26",
  subscription: "active" as const,
};

export default function CompanyPanel() {
  const [firma, setFirma] = useState(DEMO_FIRMA);
  const [hassasUyari, setHassasUyari] = useState(false);
  const [degisiklikAlan, setDegisiklikAlan] = useState("");

  const hassasAlanlar = ["tax_number", "iban"];

  const handleChange = (alan: string, deger: string) => {
    if (hassasAlanlar.includes(alan)) {
      setDegisiklikAlan(alan === "tax_number" ? "Vergi Numarası" : "IBAN");
      setHassasUyari(true);
      return;
    }
    setFirma(prev => ({ ...prev, [alan]: deger }));
  };

  return (
    <div>
      {/* Hassas değişiklik uyarısı */}
      {hassasUyari && (
        <div style={{
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          display: "flex", alignItems: "flex-start", gap: 14,
        }}>
          <AlertTriangle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--navy-900)", marginBottom: 4 }}>
              Hassas Bilgi Değişikliği
            </h4>
            <p style={{ color: "var(--steel-700)", fontSize: "0.85rem", marginBottom: 12 }}>
              <strong>{degisiklikAlan}</strong> değişikliği için OTP veya şifre doğrulaması gereklidir.
              Güvenliğiniz için lütfen doğrulama adımını tamamlayın.
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
              { key: "name", label: "Firma Adı", icon: Building, value: firma.name },
              { key: "tax_number", label: "Vergi Numarası", icon: Hash, value: firma.tax_number, hassas: true },
              { key: "authorized_person", label: "Yetkili Kişi", icon: User, value: firma.authorized_person },
              { key: "email", label: "E-posta", icon: Mail, value: firma.email },
              { key: "phone", label: "Telefon", icon: Phone, value: firma.phone },
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
          </div>
        </div>

        {/* Sağ: Abonelik & Mali */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Abonelik durumu */}
          <div className="card">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <CreditCard size={18} color="var(--navy-500)" /> Abonelik
            </h3>
            <div style={{
              padding: 16, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(30,77,140,0.05), rgba(46,106,180,0.08))",
              border: "1px solid rgba(30,77,140,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: "0.85rem", color: "var(--steel-700)" }}>Mevcut Plan</span>
                <span className="badge badge-active">AKTİF</span>
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 4 }}>Profesyonel</h4>
              <p style={{ color: "var(--steel-500)", fontSize: "0.82rem" }}>Tüm ihalelere erişim, sınırsız teklif</p>
            </div>
          </div>

          {/* IBAN */}
          <div className="card">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <CreditCard size={18} color="var(--navy-500)" />
              Banka Bilgileri
              <Shield size={12} color="var(--accent-amber)" />
            </h3>
            <div>
              <label className="form-label">IBAN</label>
              <input
                className="form-input"
                value={firma.iban}
                onChange={(e) => handleChange("iban", e.target.value)}
              />
              <p style={{ color: "var(--steel-400)", fontSize: "0.78rem", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Shield size={11} /> IBAN değişikliği OTP onayı gerektirir
              </p>
            </div>
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
