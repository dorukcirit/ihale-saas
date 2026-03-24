/**
 * Dashboard sayfası — 3 panelli firma yönetim paneli.
 * Panel 1: İhalelerim, Panel 2: Aktif İhaleler, Panel 3: Firma Paneli.
 */
"use client";

import { useState } from "react";
import { Building2, LayoutDashboard, FileText, Search, Settings, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import MyTendersPanel from "@/components/dashboard/MyTendersPanel";
import ActiveTendersPanel from "@/components/dashboard/ActiveTendersPanel";
import CompanyPanel from "@/components/dashboard/CompanyPanel";

const PANELLER = [
  { id: "ihalelerim", label: "İhalelerim", icon: FileText },
  { id: "aktif", label: "Aktif İhaleler", icon: Search },
  { id: "firma", label: "Firma Paneli", icon: Settings },
];

export default function DashboardPage() {
  const [aktifPanel, setAktifPanel] = useState("ihalelerim");

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
          {/* Dashboard header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", marginBottom: 6,
            color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.08em"
          }}>
            <LayoutDashboard size={14} />
            Dashboard
          </div>

          {PANELLER.map((panel) => {
            const aktif = aktifPanel === panel.id;
            return (
              <button
                key={panel.id}
                onClick={() => setAktifPanel(panel.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 10,
                  border: "none", cursor: "pointer",
                  fontSize: "0.9rem", fontWeight: aktif ? 600 : 400,
                  background: aktif
                    ? "rgba(46,106,180,0.15)"
                    : "transparent",
                  color: aktif ? "white" : "rgba(255,255,255,0.55)",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                <panel.icon size={18} />
                {panel.label}
              </button>
            );
          })}
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
          <button style={{
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
        {/* Başlık */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
            {PANELLER.find(p => p.id === aktifPanel)?.label}
          </h1>
          <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
            {aktifPanel === "ihalelerim" && "Kendi ihalelerinizi ve takip ettiklerinizi yönetin."}
            {aktifPanel === "aktif" && "Uzmanlık alanınıza göre aktif ihaleleri keşfedin."}
            {aktifPanel === "firma" && "Firma profilinizi ve ayarlarınızı yönetin."}
          </p>
        </div>

        {/* Panel içeriği */}
        {aktifPanel === "ihalelerim" && <MyTendersPanel />}
        {aktifPanel === "aktif" && <ActiveTendersPanel />}
        {aktifPanel === "firma" && <CompanyPanel />}
      </main>
    </div>
  );
}
