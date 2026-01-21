"use client";

import {
  GraduationCap,
  Clock,
  Star,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Search,
  CheckCircle2,
  Play,
  Calendar,
  Award,
  Target,
  Zap,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { useGetCourses } from "../../filters/use-get-courses";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@workspace/ui/lib/utils";
import { COURSE_TYPE } from "@workspace/utils/constant";
import { useDebounce } from "@/hooks/use-debounce";

const TAB_OPTIONS = [
  { id: "all", label: "সব কোর্স", icon: BookOpen, value: "all" },
  {
    id: "ssc",
    label: "SSC Foundation",
    icon: GraduationCap,
    value: COURSE_TYPE.SSC_FOUNDATION,
  },
  {
    id: "hsc",
    label: "HSC Academic",
    icon: Target,
    value: COURSE_TYPE.HSC_ACADEMIC,
  },
  {
    id: "medical",
    label: "Medical Admission",
    icon: Stethoscope,
    value: COURSE_TYPE.MEDICAL_ADMISSION,
  },
];

export const CoursesView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trpc = useTRPC();
  const [filters, setFilters] = useGetCourses();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearchQuery });
  }, [debouncedSearchQuery, filters, setFilters]);

  const { data } = useQuery(
    trpc.home.course.getManyCourses.queryOptions(filters),
  );

  const { courses = [], totalCourse = 0, students = 0 } = data || {};

  const categories = [
    { id: "all", label: "সব কোর্স", icon: BookOpen },
    { id: "ssc", label: "SSC Foundation", icon: GraduationCap },
    { id: "hsc", label: "HSC Academic", icon: Target },
    { id: "medical", label: "Medical Admission", icon: Stethoscope },
  ];

  const toBanglaNumber = (num: number | string): string => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) =>
        digit >= "0" && digit <= "9" ? banglaDigits[parseInt(digit)] : digit,
      )
      .join("");
  };

  const stats = [
    { value: toBanglaNumber(totalCourse), label: "কোর্স" },
    { value: toBanglaNumber(students), label: "শিক্ষার্থী" },
    { value: "৫০+", label: "শিক্ষক" },
    { value: "৯৫%", label: "সাফল্য" },
  ];

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
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <FadeUp className="max-w-3xl">
            <Badge className="bg-white/20 text-white border-0 mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              {totalCourse}+ প্রফেশনাল কোর্স
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              তোমার স্বপ্নের কোর্স
              <span className="block text-white/90">এখানে খুঁজে নাও</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl">
              SSC Foundation থেকে Medical Admission পর্যন্ত - সব ধরনের
              প্রস্তুতির জন্য আমাদের বিশেষজ্ঞ ফ্যাকাল্টি প্যানেল তোমার পাশে আছে।
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-md">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            className="w-full h-16 md:h-24"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="কোর্স খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                type="search"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {TAB_OPTIONS.map((tab) => (
                <Button
                  key={tab.id}
                  variant={filters.type === tab.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ ...filters, type: tab.value })}
                  className="gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filters.type === "all"
                  ? "সব কোর্স"
                  : categories.find((c) => c.id === filters.type)?.label}
              </h2>
              <p className="text-muted-foreground">
                {courses?.length}টি কোর্স পাওয়া গেছে
              </p>
            </div>
          </div>

          {courses?.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                কোনো কোর্স পাওয়া যায়নি
              </h3>
              <p className="text-muted-foreground">
                অন্য ক্যাটাগরি বা সার্চ টার্ম ব্যবহার করুন
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <StaggerItem key={course.id}>
                  <Card
                    className={cn(
                      `overflow-hidden hover:shadow-xl transition-all h-full flex flex-col`,
                      course.isPopular
                        ? `ring-2 ${getBaseColor(course.type)}`
                        : "",
                    )}
                  >
                    <div className="relative">
                      <Image
                        src={course.imageUrl || ""}
                        alt={course.name}
                        width={500}
                        height={500}
                        className="w-full h-48 object-cover"
                      />
                      {course.isPopular && (
                        <Badge className={cn("absolute top-3 right-3")}>
                          <Star className="h-3 w-3 mr-1 fill-current" />{" "}
                          জনপ্রিয়
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "absolute top-3 right-3",
                          getBgColor(course.type),
                          course.isPopular && "hidden",
                        )}
                      >
                        {Number(course.discount).toFixed(2)}% ছাড়
                      </Badge>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1 text-foreground">
                            {5}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          • {5} শিক্ষার্থী
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {course.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />{" "}
                          {course.classes.length}
                        </Badge>
                      </div>

                      <ul className="space-y-1.5 mb-4 flex-1">
                        {course.features.slice(0, 3).map((feature, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle2
                              className={cn(
                                "h-4 w-4",
                                getBaseColor(course.type),
                              )}
                            />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="border-t pt-4 mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span
                              className={cn(
                                "text-2xl font-bold",
                                getBaseColor(course.type),
                              )}
                            >
                              {Number(course.price).toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {Number(course.originalPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          শুরু:{" "}
                          {format(
                            new Date(course.startDate || new Date()),
                            "dd/MM/yyyy",
                          )}
                        </div>
                        <Button
                          size="sm"
                          className={cn(
                            "w-full text-white hover:bg-primary/80 hover:text-white/80 cursor-pointer transition-all",
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <Award className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              সঠিক কোর্স বাছতে সাহায্য দরকার?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              আমাদের কাউন্সেলরদের সাথে কথা বলুন এবং আপনার লক্ষ্য অনুযায়ী সেরা
              কোর্স বেছে নিন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Phone className="h-5 w-5" />
                  কাউন্সেলিং বুক করুন
                </Button>
              </Link>
              <Button size="lg" variant="white">
                <Play className="h-5 w-5" />
                ফ্রি ক্লাস দেখুন
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};
