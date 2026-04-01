/**
 * Panel 2: Aktif İhaleler.
 * Yeni kayıt olan (Üye) firmalar ihaleleri göremez;
 * onay/yükseltme tamamlanmış firmalar görebilir.
 */
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Clock, Calendar, Bookmark, ArrowUpDown, Lock, FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import FirmaAdi from "@/components/ui/FirmaAdi";
import VerificationBadge from "@/components/ui/VerificationBadge";

/** Demo aktif ihale verisi */
const AKTIF_IHALELER: any[] = [];

const IMALAT_FILTRE = ["Tümü", "Betonarme Karkas", "Çelik Konstrüksiyon", "HVAC", "Mantolama", "Yangın Tesisatı", "Zayıf Akım"];

import { createClient } from "@/lib/supabase/client";

/**
 * Supabase'den kullanıcının membership_type bilgisini oku.
 */
async function fetchUserTier(): Promise<1 | 2 | 3> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 1;

  const { data, error } = await (supabase as any)
    .from("firms")
    .select("membership_type")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !data) return 1;
  return data.membership_type as 1 | 2 | 3;
}

export default function ActiveTendersPanel() {
  const [aramaMetni, setAramaMetni] = useState("");
  const [seciliImalat, setSeciliImalat] = useState("Tümü");
  const [userTier, setUserTier] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Dev mod kontrolü (Hala önceliği olabilir ama gerçek veriyi de alalım)
      const isDev = typeof window !== "undefined" && localStorage.getItem("dev_mode") === "true";
      if (isDev) {
        setUserTier(3);
      } else {
        const tier = await fetchUserTier();
        setUserTier(tier);
      }
      setLoading(false);
    }
    init();
  }, []);

  const filtrelenmis = AKTIF_IHALELER.filter((ihale) => {
    const aramaUygun =
      !aramaMetni ||
      ihale.proje.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      ihale.konum.toLowerCase().includes(aramaMetni.toLowerCase());
    const imalatUygun = seciliImalat === "Tümü" || ihale.imalat === seciliImalat;
    return aramaUygun && imalatUygun;
  });

  return (
    <div>
      {/* Filtre & Arama Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
          <input
            type="text"
            className="form-input"
            placeholder="İhale (Proje) veya firma ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }} />
          <select
            className="form-input"
            value={seciliImalat}
            onChange={(e) => setSeciliImalat(e.target.value)}
            style={{ paddingLeft: 34, minWidth: 180, cursor: "pointer", appearance: "auto" }}
          >
            {IMALAT_FILTRE.map((im) => (
              <option key={im} value={im}>{im}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Üye kilidi — yeni kayıt olan kullanıcılar ihaleleri göremez */}
      {userTier < 2 && (
        <div style={{
          border: "1px solid rgba(245,158,11,0.25)",
          background: "rgba(245,158,11,0.04)",
          borderRadius: 16, padding: "40px 24px",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center", gap: 16,
          marginBottom: 24,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(245,158,11,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShieldAlert size={28} color="var(--accent-amber)" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8 }}>
              İhale Görüntüleme Kısıtlı
            </h3>
            <p style={{ color: "var(--steel-600)", fontSize: "0.9rem", maxWidth: 420, margin: "0 auto 16px" }}>
              Hesabınız <strong>Üye</strong> statüsünde. İhaleleri görüntüleyebilmek ve teklif
              verebilmek için hesabınızın onaylanması ya da planınızın yükseltilmesi gerekiyor.
            </p>
            <button className="btn-primary" style={{ padding: "11px 28px" }}>
              <Lock size={16} /> Planı Yükselt
            </button>
          </div>
        </div>
      )}

      {/* Sonuç sayısı — yalnızca erişimi olan kullanıcılara göster */}
      {userTier >= 2 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "var(--steel-500)", fontSize: "0.85rem" }}>
            <strong style={{ color: "var(--navy-800)" }}>{filtrelenmis.length}</strong> ihale bulundu
          </span>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "1px solid var(--steel-200)", borderRadius: 8,
            padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem",
            color: "var(--steel-500)"
          }}>
            <ArrowUpDown size={13} /> Son Tarih
          </button>
        </div>
      )}

      {/* İhale Kartları — yalnızca tier >= 2 görebilir */}
      {userTier >= 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtrelenmis.map((ihale) => {
            const isLocked = ihale.blue_tick_only && userTier < 3;

            return (
              <div key={ihale.id} className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>

                {/* Kilitli Katmanı */}
                {isLocked && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(4px)",
                    zIndex: 10, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8
                  }}>
                    <div style={{
                      background: "var(--navy-500)", color: "white", padding: 12,
                      borderRadius: "50%", display: "flex", boxShadow: "0 4px 12px rgba(46,106,180,0.3)"
                    }}>
                      <Lock size={20} />
                    </div>
                    <p style={{ fontWeight: 600, color: "var(--navy-900)" }}>Sadece Mavi Tikli Firmalara Özel</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--steel-600)" }}>Bu ihaleyi görebilmek ve teklif verebilmek için hesabınızı doğrulayın.</p>
                    <button className="btn-primary" style={{ marginTop: 8, padding: "6px 16px", fontSize: "0.85rem" }}>
                      Hemen Doğrula
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", opacity: isLocked ? 0.4 : 1 }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <FirmaAdi name={ihale.firma} userTier={userTier} hasBlueTick={ihale.has_blue_tick} />
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy-900)", marginBottom: 10, display: "inline-block" }}>{ihale.proje}</h3>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.82rem" }}>
                        <MapPin size={13} /> {ihale.konum}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.82rem" }}>
                        <Calendar size={13} />
                        {new Date(ihale.baslangic).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}
                        {" → "}
                        {new Date(ihale.bitis).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}
                      </span>
                      <span style={{ color: "var(--steel-500)", fontSize: "0.82rem" }}>{ihale.sure} gün</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 8,
                        background: "rgba(30,77,140,0.06)", color: "var(--navy-500)",
                        fontSize: "0.78rem", fontWeight: 600
                      }}>{ihale.imalat}</span>
                      {ihale.avans && (
                        <span style={{
                          padding: "4px 10px", borderRadius: 8,
                          background: "rgba(16,185,129,0.08)", color: "var(--accent-green)",
                          fontSize: "0.72rem", fontWeight: 600
                        }}>AVANS</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        display: "flex", alignItems: "center", gap: 4,
                        color: ihale.gun <= 7 ? "var(--accent-red)" : ihale.gun <= 14 ? "var(--accent-amber)" : "var(--steel-500)",
                        fontSize: "0.82rem", fontWeight: 600,
                      }}>
                        <Clock size={13} /> {ihale.gun} gün kaldı
                      </span>
                      <button style={{
                        background: "none", border: "1px solid var(--steel-200)", borderRadius: 8,
                        padding: "6px 12px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: "0.8rem", color: "var(--navy-500)",
                      }}>
                        <Bookmark size={13} /> Takip
                      </button>
                      <Link href={`/ihale/${ihale.id}`} style={{
                        background: "var(--navy-600)", border: "none", borderRadius: 8,
                        padding: "6px 16px", cursor: "pointer", textDecoration: "none",
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: "0.85rem", color: "white", fontWeight: 600
                      }}>
                        İncele <FileText size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
