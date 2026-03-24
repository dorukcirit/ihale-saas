/**
 * Geliştirme aşamasında sayfalar arası hızlı geçiş için "Dev Navigation" bileşeni.
 * Sadece geliştirme ortamında veya kullanıcı talebiyle ekranda sabit durur.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Terminal, ShieldCheck, LayoutDashboard, Home, 
  UserPlus, LogIn, ChevronUp, ChevronDown, LogOut
} from "lucide-react";

import { useEffect } from "react";

export default function DevNavigation() {
  const [acik, setAcik] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Client-side control
    const isDev = localStorage.getItem("dev_mode") === "true";
    setShow(isDev);
  }, []);

  if (!show) return null;

  const handleLogout = () => {
    localStorage.removeItem("dev_mode");
    setShow(false);
    window.location.reload();
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      zIndex: 9999,
      fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: acik ? "16px" : "8px 16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        width: acik ? 220 : "auto",
        maxHeight: acik ? 500 : 44,
      }}>
        <button 
          onClick={() => setAcik(!acik)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            color: "#60A5FA",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.85rem",
            width: "100%",
            justifyContent: acik ? "space-between" : "center",
            padding: 0
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Terminal size={18} />
            {acik ? "NAVİGASYON PANELİ" : "DEV"}
          </div>
          {acik ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {acik && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 1, transition: "opacity 0.2s" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
            
            <DevLink href="/" icon={Home} label="Ana Sayfa" />
            <DevLink href="/auth/kayit" icon={UserPlus} label="Üye Kayıt" />
            <DevLink href="/auth/giris" icon={LogIn} label="Üye Girişi" />
            <DevLink href="/dashboard" icon={LayoutDashboard} label="Firma Paneli" />
            
            <div style={{ height: 1, background: "rgba(255,220,220,0.08)", margin: "8px 0" }} />
            
            <DevLink href="/admin/giris" icon={ShieldCheck} label="Admin Girişi" />
            <DevLink href="/admin" icon={ShieldCheck} label="Admin Paneli" />

            <button 
              onClick={handleLogout}
              style={{
                marginTop: 8, padding: "10px", 
                background: "rgba(239, 68, 68, 0.1)", 
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 8, fontSize: "0.8rem", 
                color: "#F87171", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
            >
              <LogOut size={14} /> Geliştirici Modunu Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DevLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link href={href} style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      borderRadius: 8,
      textDecoration: "none",
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "0.85rem",
      fontWeight: 500,
      transition: "all 0.2s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
      e.currentTarget.style.color = "white";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
    }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}
