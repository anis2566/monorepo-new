import { ArrowRight, Award, Phone } from "lucide-react";

import { ScaleUp } from "@/components/scroll-animation";
import { Button } from "@workspace/ui/components/button";

export const CtaSection = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <ScaleUp>
          <Award className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            তোমার মেডিকেলে চান্স পাওয়ার যাত্রা শুরু হোক আজই!
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            আজই ভর্তি হয়ে নাও Mr. Dr. এর কোর্সে। সীমিত সিট!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2 text-lg">
              <Phone className="h-5 w-5" /> কল করুন: 01XXX-XXXXXX
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
        </ScaleUp>
      </div>
    </section>
  );
};
