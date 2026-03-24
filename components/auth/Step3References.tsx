/**
 * Kayıt Adım 3: Referanslar ve Mali Veriler.
 * Son 5 yıl iş referansları, bilanço ve risk raporu giriş alanları.
 */
"use client";

import { useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, Briefcase, UploadCloud, FileText } from "lucide-react";

interface Referans {
  employer: string;
  subject: string;
  year: number;
  location: string;
}

interface Props {
  varsayilanReferanslar: Referans[];
  varsayilanBilanco: string;
  varsayilanRisk: string;
  onSubmit: (refs: Referans[], bilanco: string, risk: string) => void;
  onBack: () => void;
}

const bosReferans = (): Referans => ({
  employer: "",
  subject: "",
  year: new Date().getFullYear(),
  location: "",
});

export default function Step3References({ varsayilanReferanslar, varsayilanBilanco, varsayilanRisk, onSubmit, onBack }: Props) {
  const [referanslar, setReferanslar] = useState<Referans[]>(
    varsayilanReferanslar.length > 0 ? varsayilanReferanslar : [bosReferans()]
  );
  const [bilanco, setBilanco] = useState(varsayilanBilanco);
  const [risk, setRisk] = useState(varsayilanRisk);
  const [katalog, setKatalog] = useState("");

  const referansEkle = () => setReferanslar(prev => [...prev, bosReferans()]);

  const referansSil = (index: number) => {
    setReferanslar(prev => prev.filter((_, i) => i !== index));
  };

  const referansGuncelle = (index: number, alan: keyof Referans, deger: string | number) => {
    setReferanslar(prev =>
      prev.map((ref, i) => (i === index ? { ...ref, [alan]: deger } : ref))
    );
  };

  const handleSubmit = () => {
    // Boş olmayan referansları filtrele
    const gecerliReferanslar = referanslar.filter(r => r.employer || r.subject);
    onSubmit(gecerliReferanslar, bilanco, risk);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Referanslar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Briefcase size={18} color="var(--navy-500)" />
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-800)" }}>
              Son 5 Yıl İş Referansları
            </h3>
          </div>
          <button
            type="button"
            onClick={referansEkle}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--steel-50)", border: "1px solid var(--steel-200)",
              borderRadius: 8, padding: "8px 14px", cursor: "pointer",
              fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-600)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--steel-100)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--steel-50)"}
          >
            <Plus size={16} /> Yeni Ekle
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
          {referanslar.map((ref, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--steel-200)",
                borderRadius: 12, padding: "16px 20px",
                background: "var(--steel-50)",
                position: "relative",
              }}
            >
              {referanslar.length > 1 && (
                <button
                  type="button"
                  onClick={() => referansSil(i)}
                  style={{
                    position: "absolute", top: -10, right: -10,
                    width: 24, height: 24, borderRadius: "50%",
                    background: "white", border: "1px solid var(--steel-200)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--accent-red)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.2s", transform: "scale(0.9)"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                >
                  <Trash2 size={12} />
                </button>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.5fr", gap: 16, alignItems: "start" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: 4 }}>İşveren Firma</label>
                  <input
                    className="form-input"
                    placeholder="Firma adı"
                    value={ref.employer}
                    onChange={(e) => referansGuncelle(i, "employer", e.target.value)}
                    style={{ height: 40, fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: 4 }}>İşin Konusu</label>
                  <input
                    className="form-input"
                    placeholder="Örn: Fabrika İnşaatı"
                    value={ref.subject}
                    onChange={(e) => referansGuncelle(i, "subject", e.target.value)}
                    style={{ height: 40, fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: 4 }}>Yıl</label>
                  <input
                    type="number"
                    className="form-input"
                    min={new Date().getFullYear() - 5}
                    max={new Date().getFullYear()}
                    value={ref.year}
                    onChange={(e) => referansGuncelle(i, "year", parseInt(e.target.value) || 0)}
                    style={{ height: 40, fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: 4 }}>Konum</label>
                  <input
                    className="form-input"
                    placeholder="İl / İlçe"
                    value={ref.location}
                    onChange={(e) => referansGuncelle(i, "location", e.target.value)}
                    style={{ height: 40, fontSize: "0.85rem" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evraklar / Dosya Yüklemeleri */}
      <div style={{ borderTop: "1px solid var(--steel-200)", paddingTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <FileText size={18} color="var(--navy-500)" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-800)" }}>
            Firma Evrakları <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--steel-400)", marginLeft: 4 }}>(Opsiyonel)</span>
          </h3>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {/* Tanıtım Kataloğu */}
          <FileUploadBox title="Tanıtım Kataloğu" desc=".pdf, .pptx yükleyebilirsiniz" />
        </div>
      </div>

      {/* Butonlar ve Uyarı */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={onBack} className="btn-secondary"
            style={{ flex: 1, color: "var(--steel-700)", borderColor: "var(--steel-200)", padding: "14px" }}>
            <ArrowLeft size={18} /> Geri
          </button>
          <button type="button" onClick={handleSubmit} className="btn-primary" style={{ flex: 2, padding: "14px", fontSize: "1rem" }}>
            Kaydı Tamamla <Check size={20} />
          </button>
        </div>
        <p style={{ 
          textAlign: "center", marginTop: 16, fontSize: "0.85rem", color: "var(--steel-500)",
          background: "var(--steel-50)", padding: "12px", borderRadius: 8, border: "1px dashed var(--steel-200)"
        }}>
          ⚠️ <strong>Bilgilendirme:</strong> Kayıt işleminiz tamamlandıktan sonra belge onay süreciniz <strong>3 iş günü</strong> içerisinde uzmanlarımız tarafından tamamlanacaktır.
        </p>
      </div>
    </div>
  );
}

function FileUploadBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div style={{ 
      border: "2px dashed var(--steel-200)", borderRadius: 12, padding: "20px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", gap: 8, background: "var(--white)", cursor: "pointer",
      transition: "all 0.2s"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "var(--navy-400)";
      e.currentTarget.style.background = "var(--steel-50)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "var(--steel-200)";
      e.currentTarget.style.background = "var(--white)";
    }}
    >
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--steel-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy-500)" }}>
        <UploadCloud size={20} />
      </div>
      <div>
        <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--navy-800)" }}>{title}</h4>
        <span style={{ fontSize: "0.75rem", color: "var(--steel-400)" }}>{desc}</span>
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--navy-600)", border: "1px solid var(--navy-200)", padding: "4px 10px", borderRadius: 100, marginTop: 4 }}>Yükle</span>
    </div>
  );
}
