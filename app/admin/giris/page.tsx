/**
 * Admin Giriş sayfası — Platform yöneticileri için.
 * Kırmızımsı ve koyu tonlarda, gelişmiş güvenlik görünümü.
 */
"use client";

import { useState } from "react";
import { ShieldAlert, Mail, Lock, Eye, EyeOff, LogIn, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminGirisPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Gerçek admin auth işlemleri burada yapılacak
    setTimeout(() => {
      setLoading(false);
      router.push("/admin");
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at center, #1b0a0a 0%, #050101 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, background: "rgba(220, 38, 38, 0.1)",
            borderRadius: 16, border: "1px solid rgba(220, 38, 38, 0.2)", marginBottom: 16
          }}>
            <ShieldAlert size={32} color="#EF4444" />
          </div>
          <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            ADMIN <span style={{ color: "#EF4444" }}>PORTAL</span>
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.85rem", marginTop: 4 }}>
            Sistem yönetimi ve denetimi.
          </p>
        </div>

        {/* Giriş Kartı */}
        <div style={{
          background: "rgba(30, 30, 30, 0.4)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* E-posta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Yönetici E-posta</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.2)" }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="admin@insaathduvari.com"
                  required
                  style={{
                    width: "100%", height: 50, padding: "0 14px 0 44px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 12, color: "white", fontSize: "0.95rem", outline: "none"
                  }}
                  onFocus={e => e.currentTarget.style.border = "1px solid #DC2626"}
                  onBlur={e => e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"}
                />
              </div>
            </div>

            {/* Şifre */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Güvenlik Anahtarı</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.2)" }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%", height: 50, padding: "0 44px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 12, color: "white", fontSize: "0.95rem", outline: "none"
                  }}
                  onFocus={e => e.currentTarget.style.border = "1px solid #DC2626"}
                  onBlur={e => e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "rgba(255, 255, 255, 0.2)", cursor: "pointer"
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="btn-primary"
              style={{
                height: 52, width: "100%", marginTop: 12,
                background: "linear-gradient(135deg, #DC2626, #991B1B)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                fontSize: "1rem", fontWeight: 600, border: "none", borderRadius: 12, color: "white",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Doğrulanıyor..." : (
                <>Yönetici Girişi <LogIn size={20} /></>
              )}
            </button>
          </form>
        </div>

        <Link href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          marginTop: 24, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.85rem"
        }}>
          Ana Sayfaya Dön <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
