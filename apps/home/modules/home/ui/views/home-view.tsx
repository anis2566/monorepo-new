import { About } from "../components/about";
import { Contact } from "../components/contact";
import { CountdownBanner } from "../components/count-down-banner";
import { Courses } from "../components/courses";
import { CtaSection } from "../components/cta-section";
import { FAQSection } from "../components/faq-section";
import { Features } from "../components/features";
import { Footer } from "../components/footer";
import GallerySection from "../components/gallary-section";
import { Header } from "../components/header";
import { HeroBanner } from "../components/hero-banner";
import { MobileCTABar } from "../components/mobile-cta-bar";
import { NoticeBoard } from "../components/notice-board";
import { PricingSection } from "../components/pricing-section";
import { QuickLinks } from "../components/quick-links";
import { StatsBanner } from "../components/stats-banner";
import { SuccessStories } from "../components/success-stories";
import { TeachersSection } from "../components/teachers-section";
import { VideoTestimonials } from "../components/video-testimonials";

export const HomeView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Countdown Banner */}
      <CountdownBanner />

      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Quick Links */}
      <QuickLinks />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Courses */}
      <Courses />

      {/* Teachers */}
      <TeachersSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Features */}
      <Features />

      {/* About */}
      <About />

      {/* Gallery */}
      <GallerySection />

      {/* Video Testimonials */}
      <VideoTestimonials />

      {/* Success Stories */}
      <SuccessStories />

      {/* CTA Section */}
      <CtaSection />

      {/* Notice Board */}
      <NoticeBoard />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Mobile CTA Bar */}
      <MobileCTABar />
    </div>
  );
};
