"use client";

import { useState } from "react";
import { ArrowLeft, Save, UploadCloud, FileText, Calendar, MapPin, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SEHIRLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

export default function YeniIhalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    baslik: "",
    kategori: "",
    ulke: "Türkiye",
    konum: "",
    yurtdisiKonum: "",
    sonTarih: "",
    butce: "",
    aciklama: "",
    tur: "Açık İhale",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Redirect to the newly created tender's detail page after 2 seconds
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
          <p style={{ color: "var(--steel-500)", marginBottom: 24 }}>İhaleniz (IHL-2024-004) sisteme kaydedildi ve uygun tedarikçilere bildiriliyor.</p>
          <div style={{ width: 32, height: 32, border: "3px solid var(--steel-200)", borderTopColor: "var(--navy-500)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <p style={{ color: "var(--steel-400)", fontSize: "0.85rem", marginTop: 16 }}>İhale detayına yönlendiriliyorsunuz...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--steel-50)", padding: "40px 20px" }}>
      {/* Logo (Sol Üst - Sabit) */}
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
            <p style={{ color: "var(--steel-500)", fontSize: "0.95rem" }}>İhtiyacınız olan taşeron veya tedarik hizmeti için detayları eksiksiz girin.</p>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ background: "white", borderRadius: 24, border: "1px solid var(--steel-200)", boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          <form onSubmit={handleSubmit}>
            
            {/* Temel Bilgiler */}
            <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--steel-100)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="var(--navy-500)" /> Temel Bilgiler
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Title */}
                <div>
                  <label className="form-label">İhale Başlığı</label>
                  <input required name="baslik" value={formData.baslik} onChange={handleChange} className="form-input" placeholder="Örn: Ankara Merkez Ofis İnce İşler Taşeronluğu" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Category */}
                  <div>
                    <label className="form-label">Kategori</label>
                    <select required name="kategori" value={formData.kategori} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
                      <option value="">Seçiniz</option>
                      <option value="kaba">Kaba İnşaat</option>
                      <option value="ince">İnce İşler</option>
                      <option value="mekanik">Mekanik Tesisat</option>
                      <option value="elektrik">Elektrik Tesisat</option>
                      <option value="malzeme">Malzeme Tedariği</option>
                    </select>
                  </div>
                  {/* Tür */}
                  <div>
                    <label className="form-label">İhale Türü</label>
                    <select required name="tur" value={formData.tur} onChange={handleChange} className="form-input" style={{ appearance: "none" }}>
                      <option value="Açık İhale">Açık İhale (Herkese Açık)</option>
                      <option value="Davetli İhale">Davetli İhale (Sadece Seçilenler)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lojistik ve Bütçe */}
            <div style={{ padding: "32px 40px", borderBottom: "1px solid var(--steel-100)", background: "var(--steel-50)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <Building2 size={18} color="var(--navy-500)" /> Lojistik ve Tahmini Bütçe
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Konum */}
                <div>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> Şantiye / Teslim Konumu</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <select name="ulke" value={formData.ulke} onChange={handleChange} className="form-input" style={{ flex: 1 }}>
                      <option value="Türkiye">Türkiye</option>
                      <option value="Yurt Dışı">Yurt Dışı</option>
                    </select>
                    
                    {formData.ulke === "Türkiye" ? (
                      <select required name="konum" value={formData.konum} onChange={handleChange} className="form-input" style={{ flex: 2 }}>
                        <option value="">İl Seçiniz</option>
                        {SEHIRLER.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input required name="yurtdisiKonum" value={formData.yurtdisiKonum} onChange={handleChange} className="form-input" placeholder="Ülke ve Şehir yazınız" style={{ flex: 2 }} />
                    )}
                  </div>
                </div>
                {/* Deadline */}
                <div>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> Son Teklif Tarihi</label>
                  <input required type="date" name="sonTarih" value={formData.sonTarih} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* Açıklama ve Belgeler */}
            <div style={{ padding: "32px 40px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 24 }}>Şartname ve Detaylar</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Açıklama */}
                <div>
                  <label className="form-label">İş Kapsamı (Özet Şartname)</label>
                  <textarea required name="aciklama" value={formData.aciklama} onChange={handleChange} className="form-input" rows={5} placeholder="İhaleye konu olan işin kapsamını, kullanılacak malzemelerin standartlarını ve özel şartlarınızı burada belirtebilirsiniz..." style={{ resize: "vertical" }} />
                </div>

                {/* Belge Yükleme alanı */}
                <div>
                  <label className="form-label">Teknik Şartname & Keşif Özeti Evrakları</label>
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
                      <p style={{ fontSize: "0.85rem", color: "var(--steel-500)" }}>PDF, Excel (.xlsx), Word (.docx) formatları desteklenir. (Max 50MB)</p>
                    </div>
                    <span style={{ background: "white", padding: "8px 20px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-700)", border: "1px solid var(--steel-200)", marginTop: 8 }}>Dosya Gözat</span>
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
