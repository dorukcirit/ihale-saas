import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, LifeBuoy, Mail, HelpCircle } from "lucide-react";

export default function YardimSayfasi() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--steel-50)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: 12, background: "white",
            border: "1px solid var(--steel-200)", color: "var(--steel-600)", transition: "all 0.2s"
          }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)" }}>Yardım Merkezi</h1>
            <p style={{ color: "var(--steel-500)", fontSize: "0.95rem" }}>Sistem kullanımı ve Sıkça Sorulan Sorular</p>
          </div>
        </div>

        {/* Content Container */}
        <div style={{ 
          background: "white", borderRadius: 24, border: "1px solid var(--steel-200)", 
          boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)", padding: "48px 40px",
          display: "flex", flexDirection: "column", gap: 32
        }}>

          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <HelpCircle size={64} color="var(--steel-300)" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: 12 }}>
              Yardım Sayfası Hazırlanıyor...
            </h2>
            <p style={{ color: "var(--steel-500)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
              İhale oluşturma, firmaları davet etme, yetkinlik belirleme ve teklif verme süreçleri ile ilgili tüm kılavuz materyallerimizi ve sıkça sorulan soruları (SSS) bu sayfada yayınlayacağız.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ padding: 24, borderRadius: 16, background: "var(--steel-50)", border: "1px solid var(--steel-200)" }}>
              <BookOpen size={24} color="var(--navy-500)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8 }}>Kullanım Kılavuzu</h3>
              <p style={{ color: "var(--steel-600)", fontSize: "0.9rem" }}>Sistem modüllerinin nasıl kullanıldığına dair detaylı dökümantasyonlar yakında eklenecek.</p>
            </div>
            <div style={{ padding: 24, borderRadius: 16, background: "var(--steel-50)", border: "1px solid var(--steel-200)" }}>
              <Mail size={24} color="var(--navy-500)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: 8 }}>Bize Ulaşın</h3>
              <p style={{ color: "var(--steel-600)", fontSize: "0.9rem" }}>Acil teknik destek talepleriniz için destek@insaatduvari.com adresine mail atabilirsiniz.</p>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
