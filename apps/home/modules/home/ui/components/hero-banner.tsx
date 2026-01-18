import { ArrowRight, Play, Sparkles } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

import { HeroText } from "@/components/scroll-animation";

export const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-b from-red-700 to-red-700/90 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          <HeroText delay={0}>
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              ২০২৬ মেডিকেল অ্যাডমিশনের জন্য প্রস্তুত হও
            </Badge>
          </HeroText>

          <HeroText delay={0.2}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              স্বপ্ন মেডিকেল হলে,
              <span className="block text-white/90">সারথি হোক Mr. Dr.</span>
            </h1>
          </HeroText>

          <HeroText delay={0.4}>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              বাংলাদেশের সেরা মেডিকেল অ্যাডমিশন কোচিং। HSC থেকে মেডিকেল -
              সম্পূর্ণ গাইডেন্স একসাথে।
            </p>
          </HeroText>

          <HeroText delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-lg px-8 hover:scale-105 transition-all"
              >
                <Play className="h-5 w-5" /> ফ্রি ক্লাস দেখুন
              </Button>
              <Button
                size="lg"
                variant="white"
                className="gap-2 text-base px-8 font-bold hover:scale-105 transition-all w-full sm:w-auto ring-2 ring-white/30 hover:ring-white/50"
              >
                এখনই ভর্তি হন{" "}
                <ArrowRight className="h-5 w-5 font-bold stroke-[2.5]" />
              </Button>
            </div>
          </HeroText>
        </div>
      </div>

      {/* Curved bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-16 md:h-24">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};
