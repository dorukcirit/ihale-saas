/**
 * Panel 1: İhalelerim.
 * İki katmanlı yapı — Kendi ihaleleri + Takip edilen ihaleler.
 */
"use client";

import { useState } from "react";
import { Plus, Eye, Clock, MapPin, ChevronRight, Star, StarOff } from "lucide-react";
import Link from "next/link";

const KENDI_IHALELERI: any[] = [];

const TAKIP_EDILEN: any[] = [];

const durumRenkleri: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "rgba(16,185,129,0.1)", text: "var(--accent-green)", label: "AKTİF" },
  draft: { bg: "rgba(245,158,11,0.1)", text: "var(--accent-amber)", label: "TASLAK" },
  completed: { bg: "rgba(140,146,164,0.1)", text: "var(--steel-700)", label: "TAMAMLANDI" },
};

export default function MyTendersPanel() {
  const [aktifSekme, setAktifSekme] = useState<"kendi" | "takip">("kendi");

  return (
    <div>
      {/* Sekme Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{
          display: "flex", background: "var(--white)", borderRadius: 10,
          border: "1px solid var(--steel-200)", overflow: "hidden"
        }}>
          {[
            { key: "kendi" as const, label: "Kendi İhalelerim", count: KENDI_IHALELERI.length },
            { key: "takip" as const, label: "Takip Ettiklerim", count: TAKIP_EDILEN.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAktifSekme(tab.key)}
              style={{
                padding: "10px 20px",
                border: "none", cursor: "pointer",
                fontSize: "0.85rem", fontWeight: aktifSekme === tab.key ? 600 : 400,
                background: aktifSekme === tab.key ? "var(--navy-600)" : "transparent",
                color: aktifSekme === tab.key ? "white" : "var(--steel-500)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {tab.label}
              <span style={{
                padding: "1px 8px", borderRadius: 9999,
                background: aktifSekme === tab.key ? "rgba(255,255,255,0.2)" : "var(--steel-100)",
                fontSize: "0.75rem", fontWeight: 700,
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        <Link href="/ihale/yeni" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
          <Plus size={16} /> Yeni İhale
        </Link>
      </div>

      {/* Kendi İhaleleri */}
      {aktifSekme === "kendi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {KENDI_IHALELERI.map((ihale) => {
            const durum = durumRenkleri[ihale.durum];
            return (
              <div key={ihale.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6, color: "var(--navy-900)" }}>{ihale.proje}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.8rem" }}>
                      <MapPin size={13} /> {ihale.konum}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.8rem" }}>
                      <Clock size={13} /> Son: {new Date(ihale.son).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span className="badge" style={{ background: durum.bg, color: durum.text, fontSize: "0.7rem" }}>{durum.label}</span>
                  {ihale.durum === "active" && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--navy-500)", fontSize: "0.85rem", fontWeight: 600 }}>
                      <Eye size={14} /> {ihale.teklifSayisi} teklif
                    </span>
                  )}
                  <ChevronRight size={18} color="var(--steel-300)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Takip Edilen */}
      {aktifSekme === "takip" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TAKIP_EDILEN.map((ihale) => (
            <div key={ihale.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: "var(--steel-400)", fontSize: "0.8rem" }}>{ihale.firma}</span>
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6, color: "var(--navy-900)" }}>{ihale.proje}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--steel-500)", fontSize: "0.8rem" }}>
                    <MapPin size={13} /> {ihale.konum}
                  </span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: ihale.gun <= 7 ? "var(--accent-amber)" : "var(--steel-500)",
                    fontSize: "0.8rem", fontWeight: ihale.gun <= 7 ? 600 : 400,
                  }}>
                    <Clock size={13} /> {ihale.gun} gün kaldı
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  padding: "4px 12px", borderRadius: 8,
                  background: "rgba(30,77,140,0.06)", color: "var(--navy-500)",
                  fontSize: "0.78rem", fontWeight: 600
                }}>{ihale.imalat}</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--accent-amber)" }}>
                  <Star size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
