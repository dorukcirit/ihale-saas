"use client";

import { useState } from "react";
import { ArrowLeft, Save, UploadCloud, FileText, Calendar, MapPin, Building2, CheckCircle2, Phone, Mail, Link as LinkIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SEHIRLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

// Simple tree for UI mock
const KATEGORI_AGACI = [
  { id: "1", name: "Zemin ve Altyapı Taşeronları (Ağır İşler)" },
  { id: "2", name: "Kaba Yapı Taşeronları" },
  { id: "3", name: "Dış Cephe ve Çatı Taşeronları (Kabuk)" },
  { id: "4", name: "İnce İnşaat ve Dekorasyon Taşeronları (İç Mekan)" },
  { id: "5", name: "Mekanik, Elektrik ve Asansör (MEP)" },
  { id: "6", name: "Peyzaj ve Çevre Düzenleme Taşeronları" },
  { id: "7", name: "Tamamlayıcı ve Yardımcı Taşeronlar" },
];

export default function YeniIhalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    project_name: "",
    subject: "",
    category_id: "",
    project_location: "",
    description: "",
    advance_available: false,
    advance_rate: "",
    duration_days: "",
    start_date: "",
    tender_start_date: "",
    tender_deadline: "",
    target_cities_type: "all", // "all", "own", "custom"
    target_cities: [] as string[],
    visibility_type: "all_paid", // "all_paid" (Uzman+Çözüm), "cozum_only" (Çözüm) - based on author tier
    barter_available: false,
    contact_phone: "",
    contact_email: "",
    external_link: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, target_cities: options }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/ihale/IHL-2024-004");
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--steel-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", padding: 48, borderRadius: 24, textAlign: "center", maxWidth: 480, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)" }}>
          <CheckCircle2 size={64} color="var(--accent-green)" style={{ margin: "0 auto 24px" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: 12 }}>İhale Başarıyla Yayınlandı!</h2>
          <p style={{ color: "var(--steel-500)", marginBottom: 24 }}>İhaleniz (IHL-2024-004) sisteme kaydedildi ve hedef kitlenize başarıyla bildiriliyor.</p>
          <div style={{ width: 32, height: 32, border: "3px solid var(--steel-200)", borderTopColor: "var(--navy-500)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ color: "var(--steel-400)", fontSize: "0.85rem", marginTop: 16 }}>İhale detayına yönlendiriliyorsunuz...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--steel-50)", padding: "40px 20px" }}>
      {/* Logo Container */}
      <div style={{ position: "absolute", top: 32, left: 40, zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg, #1E4D8C, #2E6AB4)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Building2 size={22} color="white" />
          </div>
          <span style={{ color: "var(--navy-900)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            İnşaat <span style={{ color: "var(--navy-500)" }}>Duvarı</span>
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", marginTop: 48 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: 12, background: "white",
            border: "1px solid var(--steel-200)", color: "var(--steel-600)", transition: "all 0.2s"
          }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)" }}>Yeni İhale Oluştur</h1>
            <p style={{ color: "var(--steel-500)", fontSize: "0.95rem" }}>Uzman ve Çözüm Ortağı ağımıza projenizi duyurun.</p>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ background: "white", borderRadius: 24, border: "1px solid var(--steel-200)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          <form onSubmit={handleSubmit}>
            
            {/* 1. Temel Bilgiler */}
            <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--steel-100)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="var(--navy-500)" /> 1. Temel Bilgiler
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label className="form-label">Proje Adı</label>
                  <input required name="project_name" value={formData.project_name} onChange={handleChange} className="form-input" placeholder="Örn: Ankara Merkez Plaza İnşaatı" />
                </div>
                <div>
                  <label className="form-label">İşin Konusu</label>
                  <input required name="subject" value={formData.subject} onChange={handleChange} className="form-input" placeholder="Örn: B Blok İnce İşler Taşeronluğu" />
                </div>
                <div>
                  <label className="form-label">Kategori Seçimi</label>
                  <select required name="category_id" value={formData.category_id} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
                    <option value="">İlgili Sektör / Ekip Seçiniz</option>
                    {KATEGORI_AGACI.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Açıklama</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="Detaylar, standartlar, özel koşullar..." />
                </div>
              </div>
            </div>

            {/* 2. Lojistik ve Süreç */}
            <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--steel-100)", background: "var(--steel-50)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={18} color="var(--navy-500)" /> 2. Süreç ve Bütçe
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="form-label">Proje Yeri (Şantiye Konumu)</label>
                  <select required name="project_location" value={formData.project_location} onChange={handleChange} className="form-input">
                    <option value="">İl Seçiniz</option>
                    {SEHIRLER.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">İşin Süresi (Gün)</label>
                  <input required type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} className="form-input" min="1" placeholder="Örn: 90" />
                </div>
                <div>
                  <label className="form-label">İş Başlangıç Tarihi</label>
                  <input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">İhale Çıkış Tarihi</label>
                  <input required type="date" name="tender_start_date" value={formData.tender_start_date} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">İhale Bitim (Son Teklif) Tarihi</label>
                  <input required type="date" name="tender_deadline" value={formData.tender_deadline} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div style={{ display: "flex", gap: 32, marginTop: 24, padding: "16px 20px", background: "white", borderRadius: 12, border: "1px solid var(--steel-200)" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, color: "var(--navy-800)" }}>
                    <input type="checkbox" name="advance_available" checked={formData.advance_available} onChange={handleChange} style={{ width: 18, height: 18, accentColor: "var(--navy-600)" }} />
                    Avans Veriliyor mu?
                  </label>
                  {formData.advance_available && (
                    <div style={{ marginTop: 12 }}>
                      <input type="number" name="advance_rate" value={formData.advance_rate} onChange={handleChange} className="form-input" placeholder="Avans Oranı (%)" min="0" max="100" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, color: "var(--navy-800)" }}>
                    <input type="checkbox" name="barter_available" checked={formData.barter_available} onChange={handleChange} style={{ width: 18, height: 18, accentColor: "var(--navy-600)" }} />
                    Barter Seçeneği Var mı?
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Görünürlük & Hedefleme */}
            <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--steel-100)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={18} color="var(--navy-500)" /> 3. Hedefleme
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label className="form-label">İhaleyi Görebilecekler (Seviye Hedefleme)</label>
                  <select name="visibility_type" value={formData.visibility_type} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
                    <option value="all_paid">Tüm Uzman ve Çözüm Ortakları Görebilir</option>
                    <option value="cozum_only">Sadece Çözüm Ortakları Görebilir</option>
                    <option value="custom_firms">Sadece Seçtiğim Özel Firmalar (Davetli)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Şehir Hedefleme</label>
                  <select name="target_cities_type" value={formData.target_cities_type} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
                    <option value="all">Tüm Türkiye</option>
                    <option value="own">Sadece Benim Şehrim (Profile bağlı)</option>
                    <option value="custom">Özel Şehirleri Ben Seçeceğim</option>
                  </select>
                </div>

                {formData.target_cities_type === "custom" && (
                  <div>
                    <label className="form-label">Hedef Şehirler (Birden fazla seçilebilir)</label>
                    <select multiple name="target_cities" onChange={handleCitySelect} className="form-input" style={{ height: 120 }}>
                      {SEHIRLER.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p style={{ fontSize: '0.8rem', color: 'var(--steel-500)', marginTop: 4 }}>* Çoklu seçim için Ctrl / Cmd tuşuna basılı tutun.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. İletişim & Belge */}
            <div style={{ padding: "32px 40px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={18} color="var(--navy-500)" /> 4. İletişim & Şartname
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="form-label">İhale İletişim Telefonu</label>
                  <input required name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="form-input" placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="form-label">İhale İletişim E-Postası</label>
                  <input required type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="form-input" placeholder="ihale@firma.com" />
                </div>
              </div>
              
              <div style={{ marginTop: 20 }}>
                <label className="form-label">İhale Linki (Kendi sisteminiz üzerinden çıkıyorsanız)</label>
                <div style={{ position: "relative" }}>
                  <LinkIcon size={18} color="var(--steel-400)" style={{ position: "absolute", left: 16, top: 15 }} />
                  <input name="external_link" value={formData.external_link} onChange={handleChange} className="form-input" style={{ paddingLeft: 44 }} placeholder="https://..." />
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <label className="form-label">Teknik Şartname & Ek Belgeler</label>
                <div style={{ 
                  border: "2px dashed var(--steel-200)", borderRadius: 16, padding: "32px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", gap: 12, background: "var(--steel-50)", cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--navy-400)"; e.currentTarget.style.background = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--steel-200)"; e.currentTarget.style.background = "var(--steel-50)"; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--steel-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy-500)" }}>
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 4 }}>Dosyaları Sürükleyin veya Seçin</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--steel-500)" }}>Sadece yetkilendirilmiş üyelerle paylaşılacaktır.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div style={{ padding: "24px 40px", background: "var(--steel-100)", borderTop: "1px solid var(--steel-200)", display: "flex", justifyContent: "flex-end", gap: 16 }}>
              <button type="button" onClick={() => router.back()} className="btn-secondary" style={{ padding: "12px 24px", color: "var(--steel-700)", borderColor: "var(--steel-300)" }}>
                İptal Et
              </button>
              <button disabled={loading} type="submit" className="btn-primary" style={{ padding: "12px 32px", display: "flex", alignItems: "center", gap: 10 }}>
                {loading ? "Kaydediliyor..." : (
                  <>İhaleyi Yayınla <Save size={18} /></>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
