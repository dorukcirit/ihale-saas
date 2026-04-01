/**
 * Landing sayfası Navbar bileşeni.
 * Logo, navigasyon linkleri ve CTA butonları.
 * Giriş yapmış kullanıcılar için ek linkler ve çıkış butonu.
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Building2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Ortak link stili
  const linkStyle = {
    color: "var(--steel-600)", textDecoration: "none" as const,
    fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s",
  };

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
            {user ? (
              /* Giriş yapılmış kullanıcılar */
              <>
                <Link href="/ihaleler" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >İhaleler</Link>
                <Link href="/ihalelerim" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >İhalelerim</Link>
                <Link href="/takiplerim" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Takiplerim</Link>
                <Link href="/paydaslar" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Paydaşlar</Link>
                <Link href="/yardim" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Yardım</Link>
              </>
            ) : (
              /* Ziyaretçi menüsü */
              <>
                <Link href="#ozellikler" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Özellikler</Link>
                <Link href="/abonelik" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Abonelik</Link>
                <Link href="#hakkimizda" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Hakkımızda</Link>
                <Link href="/yardim" style={linkStyle}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--navy-600)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--steel-600)"}
                >Yardım Merkezi</Link>
              </>
            )}
          </div>

          {/* CTA Butonlar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.875rem" }}>
                  Firma Paneline Git
                </Link>
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "var(--steel-700)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                  background: "transparent", border: "1px solid var(--steel-200)",
                  padding: "8px 16px", borderRadius: 8, transition: "all 0.2s", cursor: "pointer"
                }}>
                  Çıkış <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/giris" style={{
                  color: "var(--steel-700)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                  padding: "8px 20px", borderRadius: 8, transition: "all 0.2s"
                }}>Giriş Yap</Link>
                <Link href="/auth/kayit" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.875rem" }}>
                  Kayıt Ol
                </Link>
              </>
            )}
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
            {user ? (
              <>
                <Link href="/ihaleler" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>İhaleler</Link>
                <Link href="/ihalelerim" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>İhalelerim</Link>
                <Link href="/takiplerim" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Takiplerim</Link>
                <Link href="/paydaslar" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Paydaşlar</Link>
                <Link href="/yardim" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Yardım</Link>
              </>
            ) : (
              <>
                <Link href="#ozellikler" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Özellikler</Link>
                <Link href="/abonelik" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Abonelik</Link>
                <Link href="#hakkimizda" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Hakkımızda</Link>
                <Link href="/yardim" style={{ color: "var(--steel-700)", textDecoration: "none", padding: "8px 0", fontSize: "0.95rem" }}>Yardım</Link>
              </>
            )}
            <div style={{ borderTop: "1px solid var(--steel-200)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem", textAlign: "center" }}>Firma Paneli</Link>
                  <button onClick={handleLogout} style={{ color: "var(--steel-600)", textDecoration: "none", fontSize: "0.9rem", background: "none", border: "1px solid var(--steel-200)", borderRadius: 8, padding: "8px 20px" }}>Çıkış Yap</button>
                </>
              ) : (
                <>
                  <Link href="/auth/giris" style={{ color: "var(--steel-700)", textDecoration: "none", fontSize: "0.9rem", textAlign: "center", padding: "8px 20px", border: "1px solid var(--steel-200)", borderRadius: 8 }}>Giriş Yap</Link>
                  <Link href="/auth/kayit" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.875rem", textAlign: "center" }}>Kayıt Ol</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
