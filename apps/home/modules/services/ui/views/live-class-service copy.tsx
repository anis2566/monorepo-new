"use client";

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

import { getSubjectBgColor, getSubjectIcon } from "@workspace/utils";
import LiveClassVideo from "../components/live-class-video";

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
        title: "কোষ বিভাজন - মাইটোসিস",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "45:30",
        views: "12.5K",
        instructor: "ড. আহমেদ হোসেন",
      },
      {
        id: 2,
        title: "জেনেটিক্স পরিচিতি",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "38:15",
        views: "8.2K",
        instructor: "ড. আহমেদ হোসেন",
      },
      {
        id: 3,
        title: "বংশগতি ও বিবর্তন",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "52:00",
        views: "15.1K",
        instructor: "ড. আহমেদ হোসেন",
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
        title: "জৈব রসায়ন বেসিক",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "42:20",
        views: "9.8K",
        instructor: "প্রফেসর করিম",
      },
      {
        id: 2,
        title: "রাসায়নিক বন্ধন",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "35:45",
        views: "7.5K",
        instructor: "প্রফেসর করিম",
      },
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
        title: "নিউটনের গতিসূত্র",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "48:10",
        views: "18.3K",
        instructor: "ড. রহমান",
      },
      {
        id: 2,
        title: "তরঙ্গ ও শব্দ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "40:00",
        views: "11.2K",
        instructor: "ড. রহমান",
      },
      {
        id: 3,
        title: "আলোর প্রতিফলন",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "36:25",
        views: "9.4K",
        instructor: "ড. রহমান",
      },
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
        title: "ক্যালকুলাস পরিচিতি",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "55:00",
        views: "14.7K",
        instructor: "জনাব আলী",
      },
      {
        id: 2,
        title: "ত্রিকোণমিতি বেসিক",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "44:30",
        views: "10.9K",
        instructor: "জনাব আলী",
      },
    ],
  },
  {
    id: 5,
    name: "আইসিটি",
    nameEn: "ICT",
    icon: Cpu,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    videos: [
      {
        id: 1,
        title: "প্রোগ্রামিং বেসিক",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "50:15",
        views: "20.1K",
        instructor: "ইঞ্জিনিয়ার সাকিব",
      },
      {
        id: 2,
        title: "ডেটাবেস পরিচিতি",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "38:40",
        views: "8.6K",
        instructor: "ইঞ্জিনিয়ার সাকিব",
      },
    ],
  },
  {
    id: 6,
    name: "ইংরেজি",
    nameEn: "English",
    icon: BookOpen,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    videos: [
      {
        id: 1,
        title: "Grammar Fundamentals",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "42:00",
        views: "16.4K",
        instructor: "Ms. Sarah Khan",
      },
      {
        id: 2,
        title: "Essay Writing Tips",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        duration: "35:20",
        views: "12.8K",
        instructor: "Ms. Sarah Khan",
      },
    ],
  },
];

export const LiveClassServices = () => {
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
          return (
            <FadeUp key={subject.id}>
              <div className="space-y-4">
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(`p-2.5 rounded-xl`, bgColor)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground">
                        {subject.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {subject.videos.length} টি ইন্ট্রো ভিডিও
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(`hover:bg-muted`, subject.textColor)}
                  >
                    সব দেখুন
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Videos Horizontal Scroll */}
                <StaggerContainer className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                  {subject.videos.map((video) => (
                    <StaggerItem key={video.id}>
                      <Card className="group min-w-[280px] md:min-w-[320px] overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
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
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views}
                            </div>
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
