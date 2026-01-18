import { BookMarked, FileText, FlaskConical, Zap } from "lucide-react";

import { StaggerContainer, StaggerItem } from "@/components/scroll-animation";
import { Card, CardContent } from "@workspace/ui/components/card";

const quickLinks = [
  { icon: BookMarked, label: "জীববিজ্ঞান", color: "bg-green-500" },
  { icon: FlaskConical, label: "রসায়ন", color: "bg-blue-500" },
  { icon: Zap, label: "পদার্থবিজ্ঞান", color: "bg-orange-500" },
  { icon: FileText, label: "মডেল টেস্ট", color: "bg-purple-500" },
];

export const QuickLinks = () => {
  return (
    <section className="py-8 -mt-4 relative z-10">
      <div className="container mx-auto px-4">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <StaggerItem key={index}>
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-xl ${link.color} flex items-center justify-center`}
                  >
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {link.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      প্র্যাকটিস করুন
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
