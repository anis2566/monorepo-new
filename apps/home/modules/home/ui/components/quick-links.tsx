"use client";

import {
  BookMarked,
  BookOpen,
  Calculator,
  Cpu,
  Dna,
  FileText,
  FlaskConical,
  Languages,
  Zap,
} from "lucide-react";

import { StaggerContainer, StaggerItem } from "@/components/scroll-animation";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { LEVEL } from "@workspace/utils/constant";

// Map subject names to icons and colors
const subjectIconMap: Record<string, { icon: any; color: string }> = {
  জীববিজ্ঞান: { icon: Dna, color: "bg-green-500" },
  রসায়ন: { icon: FlaskConical, color: "bg-orange-500" },
  পদার্থবিজ্ঞান: { icon: Zap, color: "bg-blue-500" },
  "উচ্চতর গণিত": { icon: Calculator, color: "bg-purple-500" },
  আইসিটি: { icon: Cpu, color: "bg-yellow-500" },
  বাংলা: { icon: Languages, color: "bg-pink-500" },
  ইংরেজি: { icon: BookOpen, color: "bg-red-500" },
};

export const QuickLinks = () => {
  const trpc = useTRPC();

  const { data: subjects } = useQuery(
    trpc.home.subject.getByLevel.queryOptions({ level: LEVEL.HSC }),
  );

  return (
    <section className="py-8 -mt-4 relative z-10">
      <div className="container mx-auto px-4">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects?.map((subject, index) => {
            const subjectFirstWord = subject.name?.split(" ")[0] || "";
            const iconData = subjectIconMap[subjectFirstWord] || {
              icon: BookMarked,
              color: "bg-gray-500",
            };
            const Icon = iconData.icon;

            return (
              <StaggerItem key={subject.id || index}>
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl ${iconData.color} flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        প্র্যাকটিস করুন
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}

          {/* Model Test Card - Always shown */}
          <StaggerItem>
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-cyan-500 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">মডেল টেস্ট</p>
                  <p className="text-xs text-muted-foreground">
                    প্র্যাকটিস করুন
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};
