"use client";

import { ArrowRight, Check, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const tabs = [
  { id: "all", label: "সব কোর্স" },
  { id: "hsc", label: "HSC ব্যাচ" },
  { id: "medical", label: "মেডিকেল" },
  { id: "crash", label: "ক্র্যাশ কোর্স" },
];

export const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");

  const trpc = useTRPC();

  const { data: programs } = useQuery(
    trpc.home.program.getProgramsForHome.queryOptions(),
  );

  return (
    <section id="courses" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-10">
          <Badge
            variant="outline"
            className="mb-4 border-primary text-primary border-primary"
          >
            কোর্সসমূহ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            তোমার জন্য সেরা কোর্স বেছে নাও
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            SSC ফাউন্ডেশন, HSC একাডেমিক, মেডিকেল অ্যাডমিশন - সব ধরনের প্রস্তুতির
            জন্য আমাদের কোর্স আছে
          </p>
        </FadeUp>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant="outline"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full bg-white border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer",
                activeTab === tab.id && "bg-primary text-white",
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Course Cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs?.map((program) => (
            <StaggerItem key={program.id}>
              <Card
                className={`overflow-hidden hover:shadow-xl transition-all h-full ${program.isPopular ? "ring-2 ring-primary" : ""}`}
              >
                <div className="relative">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop"
                    }
                    alt={program.name}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover"
                  />
                  {program.isPopular && (
                    <Badge className="absolute top-3 right-3 bg-primary">
                      <Star className="h-3 w-3 mr-1 fill-current" /> জনপ্রিয়
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {program.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {program.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {program.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <Check className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ৳{" "}
                        {program.packages[0]?.price
                          ? Number(program.packages[0].price).toFixed(2)
                          : "০"}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳{" "}
                        {program.packages[0]?.originalPrice
                          ? Number(program.packages[0].originalPrice).toFixed(2)
                          : "০"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/80 hover:text-white/80 cursor-pointer transition-all"
                      variant="secondary"
                      asChild
                    >
                      <Link href={`/courses/${program.id}`}>ভর্তি হন</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer transition-all"
          >
            সব কোর্স দেখুন <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
