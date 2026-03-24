/**
 * Giriş sayfası — E-posta ve şifre ile giriş.
 * B2B odaklı, kurumsal tasarım.
 * "Demo Giriş" seçeneği ile hızlı erişim imkanı sağlar.
 */
"use client";

import { useState } from "react";
import { Building2, Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ADMIN Girişi (Gizli)
    if (email === "admin@insaatduvari.com" && password === "admin123") {
      setTimeout(() => {
        setLoading(false);
        router.push("/admin");
      }, 800);
      return;
    }

    // DEV Modu Kontrolü
    if (email === "dev@insaatduvari.com" && password === "dev123") {
      localStorage.setItem("dev_mode", "true");
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 500);
      return;
    }

    // Normal Giriş Taklidi (Şimdilik)
    localStorage.removeItem("dev_mode");
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
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

        {/* Giriş Kartı */}
        <div style={{
          background: "white",
          border: "1px solid var(--steel-200)",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: "var(--navy-900)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Hoş Geldiniz</h1>
            <p style={{ color: "var(--steel-500)", fontSize: "0.95rem" }}>
              Tedarikçi portalına güvenle giriş yapın.
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

            {/* Şifre */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ color: "var(--steel-700)", fontSize: "0.85rem", fontWeight: 600 }}>Şifre</label>
                <Link href="#" style={{ color: "var(--navy-600)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 600 }}>
                  Şifremi Unuttum
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--steel-400)" }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: "100%", height: 50, padding: "0 44px",
                    background: "var(--steel-50)", border: "1px solid var(--steel-200)",
                    borderRadius: 12, color: "var(--navy-900)", fontSize: "0.95rem", outline: "none", transition: "all 0.2s"
                  }}
                  onFocus={e => e.currentTarget.style.border = "1px solid var(--navy-500)"}
                  onBlur={e => e.currentTarget.style.border = "1px solid var(--steel-200)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "var(--steel-400)", cursor: "pointer"
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
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                fontSize: "1rem"
              }}
            >
              {loading ? "Giriş Yapılıyor..." : (
                <>Giriş Yap <LogIn size={20} /></>
              )}
            </button>
          </form>
        </div>

        {/* Alt link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "var(--steel-500)", fontSize: "0.9rem" }}>
          Henüz firmanız kayıtlı değil mi?{" "}
          <Link href="/auth/kayit" style={{ color: "var(--navy-600)", textDecoration: "none", fontWeight: 700 }}>
            Hemen Kaydolun
          </Link>
        </p>
      </div>
    </div>
  );
}
