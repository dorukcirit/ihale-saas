/**
 * Landing sayfası Navbar bileşeni.
 * Logo, navigasyon linkleri ve CTA butonları.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2 } from "lucide-react";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--steel-200)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #1E4D8C, #2E6AB4)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2  size={22} color="white" />
            </div>
            <span style={{ color: "var(--navy-900)", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              İnşaat <span style={{ color: "var(--navy-500)" }}>Duvarı</span>
            </span>
          </Link>

          {/* Desktop Menü */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            <Link href="#ozellikler" style={{ color: "var(--steel-600)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
            >Özellikler</Link>
            <Link href="#ihaleler" style={{ color: "var(--steel-600)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
            >İhaleler</Link>
            <Link href="#hakkimizda" style={{ color: "var(--steel-600)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
            >Hakkımızda</Link>
            <Link href="/yardim" style={{ color: "var(--steel-600)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
            >Yardım Merkezi</Link>
          </div>

          {/* CTA Butonlar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
            <Link href="/auth/giris" style={{
              color: "var(--steel-700)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
              padding: "8px 20px", borderRadius: 8, transition: "all 0.2s"
            }}>Giriş Yap</Link>
            <Link href="/auth/kayit" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.875rem" }}>
              Kayıt Ol
            </Link>
          </div>

          {/* Mobile Menü Butonu */}
          <button
            className="md:hidden"
            onClick={() => setMenuAcik(!menuAcik)}
            style={{ background: "none", border: "none", color: "var(--navy-900)", cursor: "pointer" }}
            aria-label="Menü"
          >
            {menuAcik ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menü */}
        {menuAcik && (
          <div className="md:hidden" style={{
            paddingBottom: 20,
            display: "flex", flexDirection: "column", gap: 12
          }}>
            <Link href="#ozellikler" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Özellikler</Link>
            <Link href="#ihaleler" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>İhaleler</Link>
            <Link href="#hakkimizda" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Hakkımızda</Link>
            <Link href="/yardim" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Yardım</Link>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", gap: 12 }}>
              <Link href="/auth/giris" style={{ color: "white", textDecoration: "none", fontSize: "0.9rem" }}>Giriş Yap</Link>
              <Link href="/auth/kayit" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem" }}>Kayıt Ol</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
