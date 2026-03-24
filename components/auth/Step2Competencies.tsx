/**
 * Kayıt Adım 2: Kurumsal Yetkinlik Seçimi.
 * Checkbox ağacı ile ana ve alt kategori seçimi.
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowRight, ArrowLeft, CheckSquare, Square } from "lucide-react";

/** Statik kategori ağacı (veritabanından gelecek — şimdilik sabit) */
const KATEGORI_AGACI = [
  {
    id: "kat-1", name: "Altyapı ve Zemin",
    children: [
      { id: "kat-1-1", name: "Hafriyat" },
      { id: "kat-1-2", name: "Zemin İyileştirme (Jet Grout, Fore Kazık)" },
      { id: "kat-1-3", name: "İksa Sistemleri" },
    ],
  },
  {
    id: "kat-2", name: "Kaba İnşaat",
    children: [
      { id: "kat-2-1", name: "Betonarme Karkas" },
      { id: "kat-2-2", name: "Çelik Konstrüksiyon" },
      { id: "kat-2-3", name: "Duvar İşleri" },
    ],
  },
  {
    id: "kat-3", name: "İnce İnşaat",
    children: [
      { id: "kat-3-1", name: "Sıva / Şap" },
      { id: "kat-3-2", name: "Zemin Kaplama" },
      { id: "kat-3-3", name: "Asma Tavan / Bölme Duvar" },
      { id: "kat-3-4", name: "Boya / Dekorasyon" },
    ],
  },
  {
    id: "kat-4", name: "Cephe & Yalıtım",
    children: [
      { id: "kat-4-1", name: "Mantolama" },
      { id: "kat-4-2", name: "Giydirme Cephe" },
      { id: "kat-4-3", name: "Su / Isı Yalıtımı" },
    ],
  },
  {
    id: "kat-5", name: "MEP (Mekanik/Elektrik)",
    children: [
      { id: "kat-5-1", name: "HVAC" },
      { id: "kat-5-2", name: "Yangın Tesisatı" },
      { id: "kat-5-3", name: "Zayıf Akım" },
      { id: "kat-5-4", name: "Otomasyon" },
    ],
  },
  {
    id: "kat-6", name: "Özel İmalat",
    children: [
      { id: "kat-6-1", name: "Mobilya / Ahşap" },
      { id: "kat-6-2", name: "Peyzaj" },
      { id: "kat-6-3", name: "Havuz" },
    ],
  },
];

interface Props {
  seciliIds: string[];
  onSubmit: (ids: string[]) => void;
  onBack: () => void;
}

export default function Step2Competencies({ seciliIds, onSubmit, onBack }: Props) {
  const [secili, setSecili] = useState<Set<string>>(new Set(seciliIds));
  const [acikKategoriler, setAcikKategoriler] = useState<Set<string>>(new Set());
  const [hata, setHata] = useState("");

  const toggleKategori = (id: string) => {
    setAcikKategoriler(prev => {
      const yeni = new Set(prev);
      if (yeni.has(id)) yeni.delete(id);
      else yeni.add(id);
      return yeni;
    });
  };

  const toggleSecim = (id: string) => {
    setSecili(prev => {
      const yeni = new Set(prev);
      if (yeni.has(id)) yeni.delete(id);
      else yeni.add(id);
      return yeni;
    });
    setHata("");
  };

  const toggleAnaKategori = (anaKat: typeof KATEGORI_AGACI[0]) => {
    const tumAltIds = anaKat.children.map(c => c.id);
    const hepsiSecili = tumAltIds.every(id => secili.has(id));
    setSecili(prev => {
      const yeni = new Set(prev);
      tumAltIds.forEach(id => {
        if (hepsiSecili) yeni.delete(id);
        else yeni.add(id);
      });
      return yeni;
    });
    setHata("");
  };

  const handleSubmit = () => {
    if (secili.size === 0) {
      setHata("En az bir yetkinlik alanı seçmelisiniz.");
      return;
    }
    onSubmit(Array.from(secili));
  };

  return (
    <div>
      <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 20, paddingRight: 4 }}>
        {KATEGORI_AGACI.map((anaKat) => {
          const acik = acikKategoriler.has(anaKat.id);
          const seciliAltSayisi = anaKat.children.filter(c => secili.has(c.id)).length;

          return (
            <div key={anaKat.id} style={{ marginBottom: 8 }}>
              {/* Ana kategori */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", borderRadius: 10,
                  background: acik ? "rgba(30,77,140,0.04)" : "transparent",
                  border: `1px solid ${acik ? "rgba(30,77,140,0.1)" : "var(--steel-200)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => toggleKategori(anaKat.id)}
              >
                {acik ? <ChevronDown size={18} color="var(--navy-500)" /> : <ChevronRight size={18} color="var(--steel-400)" />}

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleAnaKategori(anaKat); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                >
                  {seciliAltSayisi === anaKat.children.length
                    ? <CheckSquare size={18} color="var(--navy-500)" />
                    : <Square size={18} color="var(--steel-300)" />}
                </button>

                <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--navy-800)", flex: 1 }}>
                  {anaKat.name}
                </span>

                {seciliAltSayisi > 0 && (
                  <span style={{
                    padding: "2px 10px", borderRadius: 9999,
                    background: "rgba(30,77,140,0.08)", color: "var(--navy-500)",
                    fontSize: "0.75rem", fontWeight: 600
                  }}>
                    {seciliAltSayisi}/{anaKat.children.length}
                  </span>
                )}
              </div>

              {/* Alt kategoriler */}
              <AnimatePresence>
                {acik && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingLeft: 42, paddingTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      {anaKat.children.map((alt) => {
                        const altSecili = secili.has(alt.id);
                        return (
                          <label
                            key={alt.id}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "8px 12px", borderRadius: 8,
                              background: altSecili ? "rgba(30,77,140,0.04)" : "transparent",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={altSecili}
                              onChange={() => toggleSecim(alt.id)}
                              style={{ display: "none" }}
                            />
                            {altSecili
                              ? <CheckSquare size={16} color="var(--navy-500)" />
                              : <Square size={16} color="var(--steel-300)" />}
                            <span style={{
                              fontSize: "0.9rem",
                              color: altSecili ? "var(--navy-800)" : "var(--steel-700)",
                              fontWeight: altSecili ? 500 : 400,
                            }}>
                              {alt.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Seçim sayısı */}
      <div style={{
        padding: "10px 14px", borderRadius: 8,
        background: "var(--steel-50)", marginBottom: 16,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "var(--steel-700)", fontSize: "0.85rem" }}>Seçilen yetkinlik alanı</span>
        <span style={{ fontWeight: 700, color: "var(--navy-600)", fontSize: "0.95rem" }}>{secili.size}</span>
      </div>

      {hata && <p className="form-error" style={{ marginBottom: 12 }}>{hata}</p>}

      {/* Butonlar */}
      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={onBack} className="btn-secondary"
          style={{ flex: 1, color: "var(--steel-700)", borderColor: "var(--steel-200)", padding: "12px" }}>
          <ArrowLeft size={16} /> Geri
        </button>
        <button type="button" onClick={handleSubmit} className="btn-primary" style={{ flex: 2, padding: "12px" }}>
          Devam Et <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
