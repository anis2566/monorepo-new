import { Star } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

const testimonials = [
  {
    name: "ফাতিমা আক্তার",
    role: "ঢাকা মেডিকেল কলেজ",
    content:
      "Mr. Dr. এর গাইডেন্সে আমার স্বপ্ন পূরণ হয়েছে। শিক্ষকদের ডেডিকেশন অসাধারণ!",
    avatar: "ফা",
    merit: "মেধা তালিকায় ১২৩তম",
  },
  {
    name: "রফিক হাসান",
    role: "চট্টগ্রাম মেডিকেল কলেজ",
    content:
      "মক টেস্ট এবং বিস্তারিত বিশ্লেষণ আমাকে দুর্বল জায়গা চিহ্নিত করতে সাহায্য করেছে।",
    avatar: "রহ",
    merit: "মেধা তালিকায় ৪৫৬তম",
  },
  {
    name: "নুসরাত জাহান",
    role: "সলিমুল্লাহ মেডিকেল কলেজ",
    content: "মেডিকেল প্রত্যাশীদের জন্য সেরা কোচিং। স্টাডি মেটেরিয়াল অসাধারণ।",
    avatar: "নজ",
    merit: "মেধা তালিকায় ২৩৪তম",
  },
];

export const SuccessStories = () => {
  return (
    <section id="success" className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary text-primary">
            সাফল্যের গল্প
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            আমাদের সফল শিক্ষার্থীরা
          </h2>
        </FadeUp>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <Card className="border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-primary" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.merit}
                      </p>
                    </div>
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
