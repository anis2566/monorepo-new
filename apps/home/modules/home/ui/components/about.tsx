import { BookOpen, GraduationCap, Users } from "lucide-react";
import Image from "next/image";

import {
  SlideLeft,
  SlideRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { Badge } from "@workspace/ui/components/badge";

export const About = () => {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SlideLeft>
            <Badge
              variant="outline"
              className="mb-4 bg-primary/10 text-primary border-primary/30"
            >
              আমাদের সম্পর্কে
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              ডাক্তার হওয়ার স্বপ্নের সারথি হয়ে কাজ করতে চাই
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              যারা ডাক্তার হবার স্বপ্ন শৈশব থেকে নিজেদের মধ্যে লালন করে থাকে
              তাদের সেই স্বপ্নকে বাস্তবতায় রূপ দানের লক্ষ্যে সারথি হিসেবে কাজ
              করে যাচ্ছে Mr. Dr.। তুমুল প্রতিযোগিতামূলক এই ভর্তিযুদ্ধে টিকে
              থাকতে একজন শিক্ষার্থীর পরিশ্রমের পাশাপাশি প্রয়োজন সঠিক দিক
              নির্দেশনা।
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              আর সেই দিকনির্দেশনা এবং সঠিক পদ্ধতিতে মূল বই ভিত্তিক প্রস্তুতিকে
              গুরুত্ব দিয়ে সাজানো হয় Mr. Dr. এর প্রতিটি কোর্স।
            </p>

            <StaggerContainer className="grid grid-cols-3 gap-4">
              <StaggerItem className="text-center p-4 rounded-xl bg-primary/5">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">১০+</p>
                <p className="text-xs text-muted-foreground">অভিজ্ঞ শিক্ষক</p>
              </StaggerItem>
              <StaggerItem className="text-center p-4 rounded-xl bg-primary/5">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">৫০০০+</p>
                <p className="text-xs text-muted-foreground">শিক্ষার্থী</p>
              </StaggerItem>
              <StaggerItem className="text-center p-4 rounded-xl bg-primary/5">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">২০+</p>
                <p className="text-xs text-muted-foreground">কোর্স</p>
              </StaggerItem>
            </StaggerContainer>
          </SlideLeft>

          <SlideRight>
            <div className="relative">
              <div className="absolute -top-6 -right-6 h-48 w-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 h-48 w-48 bg-accent/10 rounded-full blur-3xl" />
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=500&fit=crop"
                alt="Medical education"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl relative"
              />
            </div>
          </SlideRight>
        </div>
      </div>
    </section>
  );
};
