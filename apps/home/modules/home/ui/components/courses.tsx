"use client";

import { ArrowRight, Star } from "lucide-react";
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

const tabs = [
  { id: "all", label: "সব কোর্স" },
  { id: "hsc", label: "HSC ব্যাচ" },
  { id: "medical", label: "মেডিকেল" },
  { id: "crash", label: "ক্র্যাশ কোর্স" },
];

const courses = [
  {
    id: 1,
    title: "Medical Foundation Batch for HSC 2027",
    subtitle: "ফাউন্ডেশন ব্যাচ ২০২৭",
    category: "hsc",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
    features: [
      "🔥 সপ্তাহে ৩টি লাইভ ক্লাস",
      "🔥 ৩০০+ লাইভ এক্সাম",
      "🔥 CQ, MCQ সাজেশন",
      "🔥 ২৪/৭ প্রশ্ন সমাধান",
    ],
    price: "৳ ১২,০০০",
    originalPrice: "৳ ১৫,০০০",
    popular: true,
  },
  {
    id: 2,
    title: "গোল ডিগার্স - Pre-Medical Batch 2026",
    subtitle: "প্রি-মেডিকেল ব্যাচ",
    category: "medical",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    features: [
      "☘️ ২৫০+ লাইভ ক্লাস",
      "☘️ কল ইউর মেন্টর ফিচার",
      "☘️ ফাইনাল এডমিশন পর্যন্ত সার্ভিস",
      "☘️ Test Paper Solve ফ্রি",
    ],
    price: "৳ ৮,০০০",
    originalPrice: "৳ ১০,০০০",
    popular: false,
  },
  {
    id: 3,
    title: "Final Shot - Medical Admission Crash",
    subtitle: "ক্র্যাশ কোর্স ২০২৬",
    category: "crash",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
    features: [
      "⭐️ ১৮০+ লাইভ ক্লাস",
      "⭐️ ডেইলি এক্সাম",
      "⭐️ ব্যক্তিগত মেন্টরিং",
      "⭐️ রিভিশন মেটেরিয়াল",
    ],
    price: "৳ ৫,০০০",
    originalPrice: "৳ ৭,০০০",
    popular: false,
  },
];

export const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => course.category === activeTab);

  return (
    <section id="courses" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-10">
          <Badge
            variant="outline"
            className="mb-4 border-primary text-red-700 border-red-700"
          >
            কোর্সসমূহ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            তোমার জন্য সেরা কোর্স বেছে নাও
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            HSC থেকে মেডিকেল অ্যাডমিশন - সব ধরনের প্রস্তুতির জন্য আমাদের কোর্স
            আছে
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
                "rounded-full bg-white border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all cursor-pointer",
                activeTab === tab.id && "bg-red-700 text-white"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Course Cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <StaggerItem key={course.id}>
              <Card
                className={`overflow-hidden hover:shadow-xl transition-all h-full ${course.popular ? "ring-2 ring-red-700" : ""}`}
              >
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover"
                  />
                  {course.popular && (
                    <Badge className="absolute top-3 right-3 bg-red-700">
                      <Star className="h-3 w-3 mr-1 fill-current" /> জনপ্রিয়
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.subtitle}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {course.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold text-red-700">
                        {course.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {course.originalPrice}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-700 text-white hover:bg-red-600 hover:text-white/80 cursor-pointer transition-all"
                      variant="secondary"
                    >
                      ভর্তি হন
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
            className="gap-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white cursor-pointer transition-all"
          >
            সব কোর্স দেখুন <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
