import { Clock, Stethoscope, Trophy, Users } from "lucide-react";

import { StaggerContainer, StaggerItem } from "@/components/scroll-animation";

const stats = [
  { value: "১৫+", label: "বছরের অভিজ্ঞতা", icon: Clock },
  { value: "৫০০০+", label: "শিক্ষার্থী", icon: Users },
  { value: "৯৫%", label: "সাফল্যের হার", icon: Trophy },
  { value: "৫০০+", label: "মেডিকেলে চান্স", icon: Stethoscope },
];

export const StatsBanner = () => {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index} className="text-center">
              <div className="h-14 w-14 rounded-full bg-red-700/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-7 w-7 text-red-700" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
