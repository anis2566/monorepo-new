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
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

export const CoursesView = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "সব কোর্স", icon: BookOpen },
    { id: "ssc", label: "SSC Foundation", icon: GraduationCap },
    { id: "hsc", label: "HSC Academic", icon: Target },
    { id: "medical", label: "মেডিকেল", icon: Stethoscope },
    { id: "crash", label: "ক্র্যাশ কোর্স", icon: Zap },
  ];

  const allCourses = [
    {
      id: 1,
      title: "SSC Foundation Batch 2028",
      subtitle:
        "ক্লাস ৯-১০ এর শিক্ষার্থীদের জন্য বিজ্ঞান বিভাগের ফাউন্ডেশন কোর্স",
      category: "ssc",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
      duration: "১২ মাস",
      classes: "সপ্তাহে ৪টি",
      students: "২৫০+",
      rating: 4.8,
      features: [
        "পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, গণিত",
        "সাপ্তাহিক অ্যাসেসমেন্ট টেস্ট",
        "অভিভাবক প্রগ্রেস রিপোর্ট",
        "ডাউট ক্লিয়ারিং সেশন",
      ],
      price: "৳ ৮,০০০",
      originalPrice: "৳ ১০,০০০",
      discount: "20%",
      popular: false,
      link: "/ssc-foundation",
      startDate: "১ ফেব্রুয়ারি ২০২৬",
    },
    {
      id: 2,
      title: "HSC Academic Batch 2027",
      subtitle: "HSC বিজ্ঞান বিভাগের সম্পূর্ণ একাডেমিক প্রস্তুতি",
      category: "hsc",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
      duration: "২ বছর",
      classes: "সপ্তাহে ৬টি",
      students: "৫০০+",
      rating: 4.9,
      features: [
        "বোর্ড পরীক্ষা + মেডিকেল প্রস্তুতি",
        "৩০০+ লাইভ এক্সাম",
        "CQ ও MCQ সাজেশন",
        "২৪/৭ মেন্টর সাপোর্ট",
      ],
      price: "৳ ১২,০০০",
      originalPrice: "৳ ১৫,০০০",
      discount: "20%",
      popular: true,
      link: "/hsc-academic",
      startDate: "১৫ জানুয়ারি ২০২৬",
    },
    {
      id: 3,
      title: "Medical Foundation Batch 2027",
      subtitle: "HSC ১ম বর্ষ থেকে মেডিকেলের প্রস্তুতি শুরু করো",
      category: "hsc",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop",
      duration: "১৮ মাস",
      classes: "সপ্তাহে ৫টি",
      students: "৩৫০+",
      rating: 4.8,
      features: [
        "HSC + Medical Admission Combo",
        "বায়োলজি স্পেশাল ফোকাস",
        "মক অ্যাডমিশন টেস্ট",
        "পার্সোনাল মেন্টরশিপ",
      ],
      price: "৳ ১৫,০০০",
      originalPrice: "৳ ১৮,০০০",
      discount: "17%",
      popular: false,
      link: "/hsc-academic",
      startDate: "১ মার্চ ২০২৬",
    },
    {
      id: 4,
      title: "গোল ডিগার্স - Pre-Medical 2026",
      subtitle: "মেডিকেল অ্যাডমিশনের সম্পূর্ণ প্রস্তুতি",
      category: "medical",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      duration: "১০ মাস",
      classes: "সপ্তাহে ৭টি",
      students: "৮০০+",
      rating: 4.9,
      features: [
        "২৫০+ লাইভ ক্লাস",
        "কল ইউর মেন্টর ফিচার",
        "ফাইনাল অ্যাডমিশন পর্যন্ত সার্ভিস",
        "ফ্রি টেস্ট পেপার সলভ",
      ],
      price: "৳ ৮,০০০",
      originalPrice: "৳ ১০,০০০",
      discount: "20%",
      popular: true,
      link: "/medical-admission",
      startDate: "এখনই শুরু করুন",
    },
    {
      id: 5,
      title: "Final Shot - Crash Course 2026",
      subtitle: "শেষ মুহূর্তের সর্বোচ্চ প্রস্তুতি",
      category: "crash",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
      duration: "৩ মাস",
      classes: "প্রতিদিন",
      students: "৪০০+",
      rating: 4.7,
      features: [
        "১৮০+ লাইভ ক্লাস",
        "ডেইলি এক্সাম",
        "ব্যক্তিগত মেন্টরিং",
        "রিভিশন মেটেরিয়াল",
      ],
      price: "৳ ৫,০০০",
      originalPrice: "৳ ৭,০০০",
      discount: "29%",
      popular: false,
      link: "/medical-admission",
      startDate: "১ এপ্রিল ২০২৬",
    },
    {
      id: 6,
      title: "Revision Master - Medical",
      subtitle: "সিলেবাস শেষ? এবার রিভিশন করো",
      category: "crash",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
      duration: "২ মাস",
      classes: "সপ্তাহে ৫টি",
      students: "৩০০+",
      rating: 4.6,
      features: [
        "সম্পূর্ণ সিলেবাস রিভিশন",
        "১০০+ মক টেস্ট",
        "শর্টকাট টেকনিক",
        "ফাইনাল বুস্ট সেশন",
      ],
      price: "৳ ৩,৫০০",
      originalPrice: "৳ ৫,০০০",
      discount: "30%",
      popular: false,
      link: "/medical-admission",
      startDate: "১ মে ২০২৬",
    },
    {
      id: 7,
      title: "Biology Olympiad Prep",
      subtitle: "জীববিজ্ঞান অলিম্পিয়াডের জন্য বিশেষ কোর্স",
      category: "ssc",
      image:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=250&fit=crop",
      duration: "৬ মাস",
      classes: "সপ্তাহে ২টি",
      students: "১০০+",
      rating: 4.9,
      features: [
        "অলিম্পিয়াড লেভেল কন্টেন্ট",
        "ইন্টারন্যাশনাল স্ট্যান্ডার্ড",
        "প্র্যাকটিক্যাল সেশন",
        "পাস্ট পেপার সল্ভ",
      ],
      price: "৳ ৬,০০০",
      originalPrice: "৳ ৮,০০০",
      discount: "25%",
      popular: false,
      link: "/ssc-foundation",
      startDate: "১ ফেব্রুয়ারি ২০২৬",
    },
    {
      id: 8,
      title: "Physics Mastery - HSC",
      subtitle: "পদার্থবিজ্ঞানে দুর্বল? এই কোর্স তোমার জন্য",
      category: "hsc",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      duration: "৮ মাস",
      classes: "সপ্তাহে ৩টি",
      students: "২০০+",
      rating: 4.8,
      features: [
        "কনসেপ্ট ক্লিয়ার ক্লাস",
        "প্রব্লেম সলভিং টেকনিক",
        "বোর্ড + অ্যাডমিশন ফোকাস",
        "গাণিতিক সমস্যা সমাধান",
      ],
      price: "৳ ৪,৫০০",
      originalPrice: "৳ ৬,০০০",
      discount: "25%",
      popular: false,
      link: "/hsc-academic",
      startDate: "১৫ ফেব্রুয়ারি ২০২৬",
    },
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory =
      activeCategory === "all" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { value: "৮+", label: "কোর্স" },
    { value: "২০০০+", label: "শিক্ষার্থী" },
    { value: "৫০+", label: "শিক্ষক" },
    { value: "৯৫%", label: "সাফল্য" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <FadeUp className="max-w-3xl">
            <Badge className="bg-white/20 text-white border-0 mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              ৮+ প্রফেশনাল কোর্স
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
              fill="hsl(var(--background))"
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
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
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
                {activeCategory === "all"
                  ? "সব কোর্স"
                  : categories.find((c) => c.id === activeCategory)?.label}
              </h2>
              <p className="text-muted-foreground">
                {filteredCourses.length}টি কোর্স পাওয়া গেছে
              </p>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
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
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <StaggerItem key={course.id}>
                  <Card
                    className={`overflow-hidden hover:shadow-xl transition-all h-full flex flex-col ${course.popular ? "ring-2 ring-primary" : ""}`}
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
                        <Badge className="absolute top-3 left-3 bg-primary">
                          <Star className="h-3 w-3 mr-1 fill-current" />{" "}
                          জনপ্রিয়
                        </Badge>
                      )}
                      <Badge className="absolute top-3 right-3 bg-green-600">
                        {course.discount} ছাড়
                      </Badge>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1 text-foreground">
                            {course.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          • {course.students} শিক্ষার্থী
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {course.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" /> {course.classes}
                        </Badge>
                      </div>

                      <ul className="space-y-1.5 mb-4 flex-1">
                        {course.features.slice(0, 3).map((feature, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="border-t pt-4 mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              {course.price}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {course.originalPrice}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          শুরু: {course.startDate}
                        </div>
                        <Link href={course.link} className="block">
                          <Button className="w-full gap-2">
                            বিস্তারিত দেখুন <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
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
              <Button
                size="lg"
                className="gap-2 bg-white text-primary hover:bg-white/90"
              >
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
