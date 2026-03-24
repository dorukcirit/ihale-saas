/**
 * Root layout — tüm sayfalar için ana sarmalayıcı.
 * Google Fonts (Inter) yüklenir, global stiller dahil edilir.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İnşaat Duvarı — B2B İnşaat İhale Platformu",
  description:
    "İnşaat sektöründe ihale süreçlerini dijitalleştiren güvenli B2B platform. İhale yayınlayın, teklif verin, paydaşlarınızı genişletin.",
  keywords: ["ihale", "inşaat", "B2B", "teklif", "tedarikçi", "müteahhit", "inşaat duvarı"],
};

import DevNavigation from "@/components/dev/DevNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Sadece geliştirme/test aşamasında aktif, sağ alt navigasyon */}
        <DevNavigation />
      </body>
    </html>
  );
}
