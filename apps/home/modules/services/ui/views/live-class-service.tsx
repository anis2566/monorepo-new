"use client";
import { useState } from "react";

import {
  Video,
  Play,
  Clock,
  Eye,
  ChevronRight,
  Dna,
  FlaskConical,
  Zap,
  Calculator,
  Cpu,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

import LiveClassVideo from "../components/live-class-video";

import { getSubjectBgColor, getSubjectIcon } from "@workspace/utils";


const subjects = [
  {
    id: 1,
    name: "জীববিজ্ঞান",
    nameEn: "Biology",
    icon: Dna,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    videos: [
      {
        id: 1,
        title: "কোষ ও এর গঠন",
        thumbnail: "/thumbnail-biology.png",
        duration: "45:30",
        views: "12.5K",
        instructor: "আজমল হোসেন (DMC)",
      },
    ],
  },
  {
    id: 2,
    name: "রসায়ন",
    nameEn: "Chemistry",
    icon: FlaskConical,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    videos: [
      {
        id: 1,
        title: "গুণগত রসায়ন",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "42:20",
        views: "9.8K",
        instructor: "ওয়ালিউল মোরশেদ হাসনাত (SSMC)",
      }
    ],
  },
  {
    id: 3,
    name: "পদার্থবিজ্ঞান",
    nameEn: "Physics",
    icon: Zap,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    videos: [
      {
        id: 1,
        title: "কাজ, ক্ষমতা ও শক্তি",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "48:10",
        views: "18.3K",
        instructor: "এস. এম. শাহ নেওয়াজ (BUET)",
      }
    ],
  },
  {
    id: 4,
    name: "উচ্চতর গণিত",
    nameEn: "Higher Math",
    icon: Calculator,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    videos: [
      {
        id: 1,
        title: "অন্তরীকরণ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "55:00",
        views: "14.7K",
        instructor: "ডা. ইমদাদুল কবির",
      }
    ],
  }
];

export const LiveClassServices = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Video className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">লাইভ ক্লাস</h1>
                <p className="text-red-100 text-sm md:text-base">
                  সকল বিষয়ের ইন্ট্রো ভিডিও দেখুন
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0"
              >
                {subjects.length} বিষয়
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0"
              >
                {subjects.reduce((acc, s) => acc + s.videos.length, 0)}+ ভিডিও
              </Badge>
            </div>
          </FadeUp>
        </div>
      </div>


      {/* Subjects Grid */}
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-8">
        {subjects.map((subject) => {
          const Icon = getSubjectIcon(subject.name);
          const bgColor = getSubjectBgColor(subject.name);
          const isPlaying = activeSubject === subject.nameEn;
          return (
            <FadeUp key={subject.id}>
              <div
                className={cn(
                  "space-y-6 p-6 rounded-3xl transition-all duration-500",
                  isPlaying ? "bg-muted shadow-lg ring-1 ring-primary/20" : "hover:bg-muted/30"
                )}
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(`p-3 rounded-2xl shadow-sm`, bgColor)}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                        {subject.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {subject.videos.length} টি প্রি-রেকর্ডেড ক্লাস
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(`hover:bg-white/50 rounded-xl`, subject.textColor)}
                  >
                    সব দেখুন
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Inline Video Player */}
                {isPlaying && (
                  <FadeUp>
                    <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black">
                      <LiveClassVideo subject={subject.nameEn} />
                    </div>
                  </FadeUp>
                )}

                {/* Videos Horizontal Scroll */}
                <StaggerContainer className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                  {subject.videos.map((video) => (
                    <StaggerItem key={video.id}>
                      <Card
                        onClick={() => setActiveSubject(subject.nameEn)}
                        className="group min-w-[280px] md:min-w-[320px] overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            width={500}
                            height={500}
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="h-6 w-6 text-foreground fill-current" />
                            </div>
                          </div>
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </div>
                          {/* Subject Badge */}
                          <div
                            className={`absolute top-2 left-2 ${subject.color} text-white text-xs px-2 py-1 rounded-md`}
                          >
                            {subject.nameEn}
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{video.instructor}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
};