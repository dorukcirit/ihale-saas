/**
 * Landing sayfası Footer bileşeni.
 * Platform bilgisi, bağlantılar ve copyright.
 */
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--navy-900)",
      color: "rgba(255,255,255,0.6)",
      borderTop: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>

          {/* Marka */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
              İnşaat sektöründe ihale süreçlerini dijitalleştiren B2B platform.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="#ozellikler" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Özellikler</Link>
              <Link href="/abonelik" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Abonelik Planları</Link>
              <Link href="/ihaleler" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>İhale Listeleri</Link>
              <Link href="/paydaslar" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Paydaşlar</Link>
              <Link href="/yardim" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Yardım Merkezi</Link>
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 style={{ color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Kurumsal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="#hakkimizda" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Hakkımızda</Link>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>İletişim</Link>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Kariyer</Link>
            </div>
          </div>

          {/* Yasal */}
          <div>
            <h4 style={{ color: "white", fontSize: "0.85rem", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Yasal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Gizlilik Politikası</Link>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>Kullanım Koşulları</Link>
              <Link href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.85rem" }}>KVKK</Link>
            </div>
          </div>
        </div>

        {/* Alt çizgi */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
          fontSize: "0.8rem"
        }}>
          <span>© 2026 İnşaat Duvarı — Tüm hakları saklıdır.</span>
          <span>Türkiye'de 🇹🇷 tasarlandı</span>
        </div>
      </div>
    </footer>
  );
}
