import { Phone, ArrowRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

export const MobileCTABar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <a href="tel:01XXXXXXXXX" className="flex-1">
            <Button
              variant="outline"
              className="w-full gap-2 h-12 text-base border-red-700 text-red-700 hover:bg-red-700/5"
            >
              <Phone className="h-5 w-5" />
              কল করুন
            </Button>
          </a>
          <Button
            variant="secondary"
            className="flex-1 gap-2 h-12 text-base bg-red-700 hover:bg-red-700/90 text-white"
          >
            ভর্তি হন
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
