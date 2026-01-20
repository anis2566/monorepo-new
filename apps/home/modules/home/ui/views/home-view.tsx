import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Courses } from "../components/courses";
import { CtaSection } from "../components/cta-section";
import { FAQSection } from "../components/faq-section";
import { Features } from "../components/features";
import { HeroBanner } from "../components/hero-banner";
import { MobileCTABar } from "../components/mobile-cta-bar";
import { NoticeBoard } from "../components/notice-board";
import { PricingSection } from "../components/pricing-section";
import { ProgramPathway } from "../components/program-pathway";
import { QuickLinks } from "../components/quick-links";
import { StatsBanner } from "../components/stats-banner";
import { SuccessStories } from "../components/success-stories";
import { TeachersSection } from "../components/teachers-section";
import { VideoTestimonials } from "../components/video-testimonials";

export const HomeView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Quick Links */}
      <QuickLinks />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Courses */}
      <Courses />

      {/* Program Pathway */}
      <ProgramPathway />

      {/* Teachers */}
      <TeachersSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Features */}
      <Features />

      {/* About */}
      <About />

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

      {/* Mobile CTA Bar */}
      <MobileCTABar />
    </div>
  );
};
