import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Courses } from "../components/courses";
import { CtaSection } from "../components/cta-section";
import { FAQSection } from "../components/faq-section";
import { Features } from "../components/features";
import { HeroBanner } from "../components/hero-banner";
import { MobileCTABar } from "../components/mobile-cta-bar";
import { NoticeBoard } from "../components/notice-board";
import { ProgramPathway } from "../components/program-pathway";
import { QuickActionsBar } from "../components/quick-action-bar";
import { SuccessStories } from "../components/success-stories";
import { TeachersSection } from "../components/teachers-section";
import { VideoTestimonials } from "../components/video-testimonials";

export const HomeView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Quick Action Bar */}
      <QuickActionsBar />

      {/* Teachers */}
      <TeachersSection />

      {/* Courses */}
      <Courses />

      {/* Stats Banner */}
      {/* <StatsBanner /> */}

      {/* Program Pathway */}
      <ProgramPathway />

      {/* Pricing Section */}
      {/* <PricingSection /> */}

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
