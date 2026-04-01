/**
 * Firma Profil Düzenleme sayfası — Mevcut CompanyPanel bileşenini
 * bağımsız bir sayfa olarak sunar. Sidebar dashboard layout kullanır.
 */
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CompanyPanel from "@/components/dashboard/CompanyPanel";

export default function ProfilDuzenlePage() {
  return (
    <DashboardLayout>
      {/* Başlık */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 6 }}>
          Firma Profili
        </h1>
        <p style={{ color: "var(--steel-500)", fontSize: "0.9rem" }}>
          Firma bilgilerinizi, referanslarınızı ve üyelik durumunuzu yönetin.
        </p>
      </div>

      <CompanyPanel />
    </DashboardLayout>
  );
}
