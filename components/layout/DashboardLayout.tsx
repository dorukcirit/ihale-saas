/**
 * Paylaşılan Dashboard Sidebar Layout.
 * İhalelerim, Takiplerim, Profil Düzenle gibi
 * giriş yapmış kullanıcı sayfaları bu layout'u kullanır.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2, LayoutDashboard, FileText, Search, Settings,
  Bell, LogOut, Heart, Users, PlusCircle, Home
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Genel Bakış",      icon: Home },
  { href: "/ihalelerim",  label: "Çıkılan İhaleler", icon: FileText },
  { href: "/ihaleler",    label: "İhale Listesi",     icon: Search },
  { href: "/takiplerim",  label: "Takip Edilenler",   icon: Heart },
  { href: "/paydaslar",   label: "Paydaşlar",         icon: Users },
  { href: "/profil/duzenle", label: "Firma Profili",   icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Çıkış işlemi başarısız:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--steel-50)" }}>

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: "var(--navy-900)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 36, padding: "0 8px" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #1E4D8C, #2E6AB4)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Building2 size={18} color="white" />
          </div>
          <span style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>
            İnşaat <span style={{ color: "#5A8FD4" }}>Duvarı</span>
          </span>
        </Link>

        {/* Navigasyon */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {/* Başlık */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", marginBottom: 6,
            color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.08em"
          }}>
            <LayoutDashboard size={14} />
            Dashboard
          </div>

          {NAV_ITEMS.map((item) => {
            const aktif = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 10,
                  fontSize: "0.9rem", fontWeight: aktif ? 600 : 400,
                  background: aktif ? "rgba(46,106,180,0.15)" : "transparent",
                  color: aktif ? "white" : "rgba(255,255,255,0.55)",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {/* Yeni İhale CTA */}
          <Link
            href="/ihale/yeni"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10, marginTop: 12,
              fontSize: "0.9rem", fontWeight: 600,
              background: "linear-gradient(135deg, var(--navy-600), var(--navy-500))",
              color: "white",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <PlusCircle size={18} />
            Yeni İhale Oluştur
          </Link>
        </nav>

        {/* Alt kısım */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 8,
            border: "none", cursor: "pointer",
            fontSize: "0.85rem", background: "transparent",
            color: "rgba(255,255,255,0.45)",
          }}>
            <Bell size={16} />
            Bildirimler
            <span style={{
              marginLeft: "auto", padding: "2px 8px",
              background: "var(--accent-red)", color: "white",
              borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700
            }}>3</span>
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 8,
              border: "none", cursor: "pointer",
              fontSize: "0.85rem", background: "transparent",
              color: "rgba(255,255,255,0.45)",
            }}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main style={{ flex: 1, padding: "32px 36px", maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  );
}
