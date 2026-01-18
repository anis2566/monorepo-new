import { Video, FileText, Headphones, BookOpen } from "lucide-react";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";

const features = [
  {
    icon: Video,
    title: "লাইভ ক্লাস",
    description: "প্রতিদিন লাইভ ক্লাস অভিজ্ঞ শিক্ষকদের সাথে",
    color: "bg-red-500",
  },
  {
    icon: FileText,
    title: "ডেইলি এক্সাম",
    description: "প্রতিদিন মডেল টেস্ট এবং বিস্তারিত বিশ্লেষণ",
    color: "bg-blue-500",
  },
  {
    icon: Headphones,
    title: "২৪/৭ সাপোর্ট",
    description: "যেকোনো সময় প্রশ্ন করুন, উত্তর পান",
    color: "bg-green-500",
  },
  {
    icon: BookOpen,
    title: "মূল বই ভিত্তিক",
    description: "HSC সিলেবাস অনুযায়ী কন্টেন্ট",
    color: "bg-purple-500",
  },
];

export const Features = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            কেন Mr. Dr.?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            আমাদের বিশেষত্ব
          </h2>
        </FadeUp>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <Card className="border-0 shadow-md text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div
                    className={`h-16 w-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
