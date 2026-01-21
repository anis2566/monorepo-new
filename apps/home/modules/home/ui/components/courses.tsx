"use client";

import { ArrowRight, BookOpen, CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { cn } from "@workspace/ui/lib/utils";

import { COURSE_TYPE } from "@workspace/utils/constant";

const TAB_OPTIONS = [
  { id: "all", label: "সব কোর্স" },
  ...Object.values(COURSE_TYPE).map((type) => ({
    id: type,
    label: type,
  })),
];

export const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");

  const trpc = useTRPC();

  const { data: courses } = useQuery(
    trpc.home.course.getCoursesForHome.queryOptions({
      type: activeTab,
    }),
  );

  const redirectionLink = (id: string, type: string) => {
    if (type === COURSE_TYPE.SSC_FOUNDATION) {
      return `/courses/ssc/${id}`;
    }
    if (type === COURSE_TYPE.HSC_ACADEMIC) {
      return `/courses/hsc/${id}`;
    }
    if (type === COURSE_TYPE.MEDICAL_ADMISSION) {
      return `/courses/medical/${id}`;
    }
    return `/courses/${id}`;
  };

  const getBaseColor = (type: string) => {
    if (type === COURSE_TYPE.SSC_FOUNDATION) {
      return "text-green-500";
    }
    if (type === COURSE_TYPE.HSC_ACADEMIC) {
      return "text-blue-500";
    }
    if (type === COURSE_TYPE.MEDICAL_ADMISSION) {
      return "text-red-500";
    }
    return "text-primary";
  };

  const getBgColor = (type: string) => {
    if (type === COURSE_TYPE.SSC_FOUNDATION) {
      return "bg-green-500";
    }
    if (type === COURSE_TYPE.HSC_ACADEMIC) {
      return "bg-blue-500";
    }
    if (type === COURSE_TYPE.MEDICAL_ADMISSION) {
      return "bg-red-500";
    }
    return "bg-primary";
  };

  return (
    <section id="courses" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <FadeUp className="text-center mb-6">
          <Badge
            variant="outline"
            className="mb-4 text-primary border-primary text-xl"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            কোর্সসমূহ
          </Badge>
        </FadeUp>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TAB_OPTIONS.map((tab) => (
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
          {courses?.map((course) => (
            <StaggerItem key={course.id}>
              <Card
                className={cn(
                  "overflow-hidden hover:shadow-xl transition-all h-full",
                  course.isPopular ? `ring-2 ${getBaseColor(course.type)}` : "",
                )}
              >
                <div className="relative">
                  <Image
                    src={course.imageUrl ?? ""}
                    alt={course.name}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover"
                  />
                  {course.isPopular && (
                    <Badge
                      className={cn(
                        "absolute top-3 right-3",
                        getBgColor(course.type),
                      )}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" /> জনপ্রিয়
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {course.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <CheckCircle2
                          className={cn("h-4 w-4", getBaseColor(course.type))}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span
                        className={cn(
                          "text-2xl font-bold",
                          getBaseColor(course.type),
                        )}
                      >
                        ৳ {Number(course.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳ {Number(course.originalPrice).toFixed(2)}
                      </span>
                      <Badge className="block" variant="outline">
                        {course.pricingLifeCycle}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        "text-white hover:bg-primary/80 hover:text-white/80 cursor-pointer transition-all",
                        getBgColor(course.type),
                      )}
                      variant="secondary"
                      asChild
                    >
                      <Link href={redirectionLink(course.id, course.type)}>
                        বিস্তারিত
                      </Link>
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
            asChild
          >
            <Link href="/courses">
              <span>সব কোর্স দেখুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
