/**
 * Abonelik tanıtım sayfası — 3 farklı üyelik seviyesini karşılaştırmalı gösterir.
 * Temel, Uzman ve Çözüm Ortağı planları detaylı özellik karşılaştırma tablosuyla sunulur.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, X, Star, Zap, Crown, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const PLANLAR = [
  {
    id: "temel",
    ad: "Temel",
    fiyat: "Ücretsiz",
    fiyatNot: "Süresiz",
    aciklama: "Platforma giriş yapın, ihaleleri maskeli olarak görüntüleyin.",
    icon: Star,
    renk: "var(--steel-500)",
    arkaPlan: "var(--steel-50)",
    borderRenk: "var(--steel-200)",
    ozellikler: [
      { ozellik: "Firma Profili Oluşturma", var: true },
      { ozellik: "İhale Listesini Görüntüleme (Maskeli)", var: true },
      { ozellik: "İhale Detay Görüntüleme", var: false },
      { ozellik: "İhale Oluşturma", var: false },
      { ozellik: "Teklif Verme", var: false },
      { ozellik: "Paydaş Ağına Erişim", var: false },
      { ozellik: "Öncelikli Destek", var: false },
    ]
  },
  {
    id: "uzman",
    ad: "Uzman",
    fiyat: "₺999",
    fiyatNot: "/ ay",
    aciklama: "İhaleleri tam görüntüleyin, teklif verin ve ağınızı genişletin.",
    icon: Zap,
    renk: "var(--navy-500)",
    arkaPlan: "linear-gradient(135deg, rgba(30, 77, 140, 0.03), rgba(46, 106, 180, 0.06))",
    borderRenk: "var(--navy-300)",
    popular: true,
    ozellikler: [
      { ozellik: "Firma Profili Oluşturma", var: true },
      { ozellik: "İhale Listesini Tam Görüntüleme", var: true },
      { ozellik: "İhale Detay Görüntüleme", var: true },
      { ozellik: "İhale Oluşturma (5 / ay)", var: true },
      { ozellik: "Teklif Verme", var: true },
      { ozellik: "Paydaş Ağına Erişim", var: false },
      { ozellik: "Öncelikli Destek", var: false },
    ]
  },
  {
    id: "cozum",
    ad: "Çözüm Ortağı",
    fiyat: "₺2.499",
    fiyatNot: "/ ay",
    aciklama: "Tam erişim. Paydaş ağı, sınırsız ihale ve öncelikli destek.",
    icon: Crown,
    renk: "#B8860B",
    arkaPlan: "linear-gradient(135deg, rgba(184, 134, 11, 0.03), rgba(218, 165, 32, 0.06))",
    borderRenk: "rgba(184, 134, 11, 0.3)",
    ozellikler: [
      { ozellik: "Firma Profili Oluşturma", var: true },
      { ozellik: "İhale Listesini Tam Görüntüleme", var: true },
      { ozellik: "İhale Detay Görüntüleme", var: true },
      { ozellik: "İhale Oluşturma (Sınırsız)", var: true },
      { ozellik: "Teklif Verme", var: true },
      { ozellik: "Paydaş Ağına Erişim", var: true },
      { ozellik: "Öncelikli Destek", var: true },
    ]
  }
];

const SSS = [
  {
    soru: "Temel üyelik gerçekten ücretsiz mi?",
    cevap: "Evet, Temel üyelik tamamen ücretsizdir ve süresizdir. Firma profilinizi oluşturabilir ve ihale listesini maskeli olarak görüntüleyebilirsiniz. İhale detaylarına erişim için Uzman veya Çözüm Ortağı planına yükseltmeniz gerekir."
  },
  {
    soru: "Planımı istediğim zaman değiştirebilir miyim?",
    cevap: "Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Yükseltmeler anında aktif olur, düşürmeler ise mevcut fatura döneminin sonunda geçerli olur."
  },
  {
    soru: "Ödeme yöntemleri nelerdir?",
    cevap: "Kredi kartı ve banka kartı ile ödeme yapabilirsiniz. Kurumsal fatura kesimi için lütfen destek ekibimizle iletişime geçin."
  },
  {
    soru: "Paydaş ağı nedir?",
    cevap: "Paydaş ağı, Çözüm Ortağı üyelerin diğer firmaları çözüm ortağı olarak seçebildiği özel bir ağdır. Bu sayede güvenilir firmalarla doğrudan iletişim kurabilir ve işbirliği fırsatları yaratabilirsiniz."
  },
  {
    soru: "İptal işlemi nasıl yapılır?",
    cevap: "Firma Profili sayfanızdan aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut fatura döneminin sonuna kadar tüm özelliklerinize erişiminiz devam eder."
  }
];

export default function AbonelikPage() {
  const [acikSSS, setAcikSSS] = useState<number | null>(null);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{
        paddingTop: 140, paddingBottom: 80,
        background: "linear-gradient(180deg, rgba(30,77,140,0.04) 0%, #FFFFFF 100%)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 100,
            background: "rgba(30,77,140,0.06)", color: "var(--navy-600)",
            fontSize: "0.8rem", fontWeight: 700, marginBottom: 20,
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}>
            Abonelik Planları
          </span>
          <h1 style={{
            fontSize: "2.8rem", fontWeight: 800, color: "var(--navy-900)",
            lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20,
          }}>
            Firmanız İçin Doğru<br />
            <span style={{ color: "var(--navy-500)" }}>Planı Seçin</span>
          </h1>
          <p style={{ color: "var(--steel-500)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            İhale süreçlerinizi dijitalleştirin, paydaşlarınızı genişletin.
            İhtiyacınıza uygun planla hemen başlayın.
          </p>
        </div>
      </section>

      {/* Fiyatlandırma Kartları */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }}>
          {PLANLAR.map((plan) => (
            <div key={plan.id} style={{
              position: "relative",
              background: plan.arkaPlan,
              border: `2px solid ${plan.borderRenk}`,
              borderRadius: 24,
              padding: "36px 32px",
              transition: "all 0.3s",
              transform: plan.popular ? "scale(1.04)" : "scale(1)",
              boxShadow: plan.popular ? "0 20px 50px -15px rgba(30, 77, 140, 0.15)" : "var(--shadow-sm)",
            }}>
              {/* Popüler Badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--navy-600)", color: "white",
                  padding: "6px 20px", borderRadius: 100,
                  fontSize: "0.75rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  boxShadow: "0 4px 12px rgba(30, 77, 140, 0.3)"
                }}>
                  En Popüler
                </div>
              )}

              {/* Başlık */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${plan.renk}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <plan.icon size={22} color={plan.renk} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy-900)" }}>{plan.ad}</h3>
              </div>

              {/* Fiyat */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--navy-900)" }}>{plan.fiyat}</span>
                <span style={{ color: "var(--steel-400)", fontSize: "0.9rem", fontWeight: 500, marginLeft: 4 }}>{plan.fiyatNot}</span>
              </div>

              <p style={{ color: "var(--steel-600)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: 28 }}>
                {plan.aciklama}
              </p>

              {/* CTA */}
              <Link
                href="/auth/kayit"
                className="btn-primary"
                style={{
                  width: "100%", padding: "14px 0", textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: plan.popular
                    ? "linear-gradient(135deg, var(--navy-600), var(--navy-500))"
                    : "white",
                  color: plan.popular ? "white" : "var(--navy-700)",
                  border: plan.popular ? "none" : "1.5px solid var(--steel-200)",
                  boxShadow: plan.popular ? "0 8px 20px -6px rgba(30, 77, 140, 0.4)" : "none",
                }}
              >
                Hemen Başla <ArrowRight size={16} />
              </Link>

              {/* Özellikler */}
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--steel-200)" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--steel-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  İçerikler
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {plan.ozellikler.map((oz, idx) => (
                    <li key={idx} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      fontSize: "0.88rem", fontWeight: 500,
                      color: oz.var ? "var(--navy-800)" : "var(--steel-400)",
                    }}>
                      {oz.var ? (
                        <Check size={16} color="var(--accent-green)" />
                      ) : (
                        <X size={16} color="var(--steel-300)" />
                      )}
                      <span style={{ textDecoration: oz.var ? "none" : "line-through" }}>{oz.ozellik}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SSS */}
      <section style={{
        maxWidth: 720, margin: "0 auto", padding: "0 24px 100px",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--navy-900)", textAlign: "center", marginBottom: 40 }}>
          Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SSS.map((item, idx) => (
            <div key={idx} style={{
              background: "white", border: "1px solid var(--steel-200)",
              borderRadius: 16, overflow: "hidden",
              transition: "all 0.2s",
            }}>
              <button
                onClick={() => setAcikSSS(acikSSS === idx ? null : idx)}
                style={{
                  width: "100%", padding: "20px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "1rem", fontWeight: 600, color: "var(--navy-800)",
                  textAlign: "left",
                }}
              >
                {item.soru}
                {acikSSS === idx ? <ChevronUp size={18} color="var(--steel-400)" /> : <ChevronDown size={18} color="var(--steel-400)" />}
              </button>
              {acikSSS === idx && (
                <div style={{
                  padding: "0 24px 20px",
                  color: "var(--steel-600)", fontSize: "0.9rem", lineHeight: 1.7,
                  animation: "fadeInUp 0.2s ease-out",
                }}>
                  {item.cevap}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
