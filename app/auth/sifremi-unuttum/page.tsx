/**
 * Şifremi Unuttum sayfası — E-posta ile şifre sıfırlama bağlantısı gönderimi.
 * Giriş sayfasıyla aynı görsel dile sahip, minimal ve temiz tasarım.
 */
"use client";

import { useState } from "react";
import { Building2, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [gonderildi, setGonderildi] = useState(false);
  const [hata, setHata] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHata("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/sifre-sifirla`,
      });

      if (error) {
        setHata(error.message);
      } else {
        setGonderildi(true);
      }
    } catch {
      setHata("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      backgroundImage: "radial-gradient(at 100% 0%, rgba(30, 77, 140, 0.03) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(30, 77, 140, 0.03) 0px, transparent 50%)"
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo (Sol Üst - Sabit) */}
        <div style={{ position: "absolute", top: 32, left: 40 }}>
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

        {/* Kart */}
        <div style={{
          background: "white",
          border: "1px solid var(--steel-200)",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        }}>
          {gonderildi ? (
            /* Başarı Durumu */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <CheckCircle2 size={36} color="var(--accent-green)" />
              </div>
              <h1 style={{ color: "var(--navy-900)", fontSize: "1.4rem", fontWeight: 800, marginBottom: 12 }}>
                E-posta Gönderildi
              </h1>
              <p style={{ color: "var(--steel-500)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 28 }}>
                <strong style={{ color: "var(--navy-800)" }}>{email}</strong> adresine
                şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu (ve spam klasörünüzü) kontrol edin.
              </p>
              <Link
                href="/auth/giris"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  color: "var(--navy-600)", textDecoration: "none", fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <ArrowLeft size={16} /> Giriş Sayfasına Dön
              </Link>
            </div>
          ) : (
            /* Form Durumu */
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: "var(--navy-900)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  Şifrenizi mi Unuttunuz?
                </h1>
                <p style={{ color: "var(--steel-500)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* E-posta */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ color: "var(--steel-700)", fontSize: "0.85rem", fontWeight: 600 }}>E-posta Adresi</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: "100%", height: 50, padding: "0 14px 0 44px",
                        background: "var(--steel-50)", border: "1px solid var(--steel-200)",
                        borderRadius: 12, color: "var(--navy-900)", fontSize: "0.95rem", outline: "none", transition: "all 0.2s"
                      }}
                      onFocus={e => e.currentTarget.style.border = "1px solid var(--navy-500)"}
                      onBlur={e => e.currentTarget.style.border = "1px solid var(--steel-200)"}
                    />
                  </div>
                </div>

                {/* Hata Mesajı */}
                {hata && (
                  <div style={{
                    padding: "12px 16px", borderRadius: 10,
                    background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)",
                    color: "var(--accent-red)", fontSize: "0.85rem", fontWeight: 500,
                  }}>
                    {hata}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="btn-primary"
                  style={{
                    height: 52, width: "100%", marginTop: 4,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    fontSize: "1rem"
                  }}
                >
                  {loading ? "Gönderiliyor..." : (
                    <>Sıfırlama Bağlantısı Gönder <Send size={18} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Alt Link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "var(--steel-500)", fontSize: "0.9rem" }}>
          <Link href="/auth/giris" style={{ color: "var(--navy-600)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> Giriş Sayfasına Dön
          </Link>
        </p>
      </div>
    </div>
  );
}
