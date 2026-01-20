"use client";

import { GraduationCap, Award, BookOpen } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

const teachers = [
  {
    id: 1,
    name: "ড. আহমেদ হোসেন",
    nameEn: "Dr. Ahmed Hossain",
    designation: "প্রধান প্রভাষক",
    subject: "জীববিজ্ঞান",
    qualification: "MBBS, PhD (DU)",
    experience: "১৫+ বছর",
    specialization: "উদ্ভিদবিজ্ঞান ও প্রাণীবিজ্ঞান",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    achievements: ["Best Teacher Award 2023", "Published 20+ Research Papers"],
  },
  {
    id: 2,
    name: "ড. ফাতেমা খাতুন",
    nameEn: "Dr. Fatema Khatun",
    designation: "সিনিয়র প্রভাষক",
    subject: "রসায়ন",
    qualification: "MSc, PhD (BUET)",
    experience: "১২+ বছর",
    specialization: "জৈব রসায়ন ও অজৈব রসায়ন",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    achievements: ["National Science Award", "Chemistry Olympiad Mentor"],
  },
  {
    id: 3,
    name: "মোঃ রফিকুল ইসলাম",
    nameEn: "Md. Rafiqul Islam",
    designation: "প্রভাষক",
    subject: "পদার্থবিজ্ঞান",
    qualification: "MSc (DU), BCS (Education)",
    experience: "১০+ বছর",
    specialization: "তাপগতিবিদ্যা ও আলোকবিজ্ঞান",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    achievements: ["Expert in Medical Physics", "1000+ Students Guided"],
  },
  {
    id: 4,
    name: "ড. নাজমা বেগম",
    nameEn: "Dr. Nazma Begum",
    designation: "সিনিয়র প্রভাষক",
    subject: "ইংরেজি",
    qualification: "MA, PhD (JU)",
    experience: "১৪+ বছর",
    specialization: "গ্রামার ও কম্প্রিহেনশন",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    achievements: ["IELTS Trainer", "Author of 5 Books"],
  },
  {
    id: 5,
    name: "মোঃ কামরুল হাসান",
    nameEn: "Md. Kamrul Hasan",
    designation: "প্রভাষক",
    subject: "গণিত",
    qualification: "MSc (RU)",
    experience: "৮+ বছর",
    specialization: "ক্যালকুলাস ও বীজগণিত",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    achievements: ["Math Olympiad Coach", "Problem Solving Expert"],
  },
  {
    id: 6,
    name: "ড. সালমা আক্তার",
    nameEn: "Dr. Salma Akter",
    designation: "প্রধান প্রভাষক",
    subject: "জীববিজ্ঞান",
    qualification: "MBBS, MS (DMC)",
    experience: "১৮+ বছর",
    specialization: "শারীরবিদ্যা ও জীববিজ্ঞান",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    achievements: ["Former DMC Faculty", "Medical Admission Expert"],
  },
];

export const TeachersSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              আমাদের শিক্ষকমণ্ডলী
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              SSC থেকে Medical - অভিজ্ঞ শিক্ষকদের সাথে পড়ুন
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SSC Foundation, HSC একাডেমিক এবং Medical Admission - সব পর্যায়ে
              আমাদের অভিজ্ঞ শিক্ষকরা শিক্ষার্থীদের সাফল্যের পথে সঙ্গী হচ্ছেন
            </p>
          </div>
        </FadeUp>

        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teachers.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.image}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2">
                            {teacher.subject}
                          </Badge>
                          <h3 className="text-xl font-bold text-white">
                            {teacher.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {teacher.nameEn}
                          </p>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">
                            {teacher.designation}
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {teacher.experience}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="w-4 h-4 text-primary" />
                            <span>{teacher.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>{teacher.specialization}</span>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs font-medium text-foreground mb-2">
                            বিশেষ অর্জন:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.achievements.map((achievement, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-background border-border hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-background border-border hover:bg-primary hover:text-primary-foreground" />
          </Carousel>

          {/* Mobile Scroll Indicator */}
          <div className="flex justify-center gap-1 mt-6 md:hidden">
            <span className="text-xs text-muted-foreground">
              ← সোয়াইপ করুন →
            </span>
          </div>
        </div>

        {/* Stats */}
        {/* Program Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 mb-8">
          <Badge className="bg-green-500/10 text-green-600 border-green-500/30 px-4 py-2 text-sm">
            🎯 SSC Foundation
          </Badge>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 px-4 py-2 text-sm">
            📚 HSC Academic
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm">
            🩺 Medical Admission
          </Badge>
        </div>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "২৫+", label: "অভিজ্ঞ শিক্ষক" },
            { value: "৩টি", label: "একাডেমিক প্রোগ্রাম" },
            { value: "১০০%", label: "সাফল্যের হার" },
            { value: "৫০০০+", label: "সফল শিক্ষার্থী" },
          ].map((stat, index) => (
            <StaggerItem key={index}>
              <div className="text-center p-4 rounded-lg bg-card border border-border/50">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
