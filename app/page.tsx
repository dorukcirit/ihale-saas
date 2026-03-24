/**
 * Landing sayfası — Hero Billboard + Maskelenmiş İhale Panosu + Özellikler.
 * Herkese açık ana sayfa.
 */
import Navbar from "@/components/layout/Navbar";
import HeroBillboard from "@/components/landing/HeroBillboard";
import MaskedTenderBoard from "@/components/landing/MaskedTenderBoard";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroBillboard />
      <FeaturesSection />
      <MaskedTenderBoard />
      <Footer />
    </main>
  );
}
