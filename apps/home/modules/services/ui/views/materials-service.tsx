"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Download,
  Eye,
  ChevronRight,
  ChevronDown,
  Beaker,
  Atom,
  Dna,
  Calculator,
  Globe,
  BookMarked,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { getSubjectBgColor, getSubjectIcon } from "@workspace/utils";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const MaterialsServices = () => {
  const trpc = useTRPC();
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  // Fetch subjects with nested chapters for materials
  const { data: subjects, isLoading } = useQuery(
    trpc.home.service.getMaterials.queryOptions(),
  );

  const toggleExpand = (cardId: string) => {
    setExpandedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  };

  const materialSections = [
    {
      id: "concept-book",
      title: "কনসেপ্ট বুক",
      titleEn: "Concept Book",
      description: "বিষয়ভিত্তিক কনসেপ্ট ক্লিয়ার করার জন্য বিশেষায়িত বই",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      subjects: subjects || [],
    },
    {
      id: "marked-book",
      title: "দাগানো বই",
      titleEn: "Marked Book",
      description: "গুরুত্বপূর্ণ পয়েন্ট হাইলাইট করা রেডি-টু-রিড বই",
      icon: BookMarked,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      subjects: subjects || [],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-background to-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">ম্যাটারিয়ালস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <FadeUp>
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  ম্যাটারিয়ালস
                </h1>
                <p className="text-white/80 text-sm">
                  Materials & Study Resources
                </p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl mb-6">
              বিষয়ভিত্তিক কনসেপ্ট বুক এবং দাগানো বই - পড়াশোনার জন্য সেরা
              রিসোর্স
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                <FileText className="h-4 w-4 mr-2" />
                {materialSections.length} ক্যাটাগরি
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                <BookOpen className="h-4 w-4 mr-2" />
                {materialSections.reduce(
                  (acc, s) =>
                    acc +
                    s.subjects.reduce((a, sub: any) => a + sub.chapters.length, 0),
                  0,
                )}
                + ম্যাটারিয়াল
              </Badge>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Material Sections */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {materialSections.map((section, sectionIndex) => {
          return (
            <FadeUp key={section.id} delay={sectionIndex * 0.1}>
              <div className="space-y-6">
                {/* Section Header */}
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl ${section.bgColor} border ${section.borderColor}`}
                >
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}
                  >
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="hidden md:flex">
                    {section.subjects.length} বিষয়
                  </Badge>
                </div>

                {/* Subjects Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.subjects.map((subject: any) => {
                    const Icon = getSubjectIcon(subject.name);
                    const bgColor = getSubjectBgColor(subject.name);
                    const cardId = `${section.id}-${subject.id}`;
                    const isExpanded = expandedCards.includes(cardId);
                    const displayedChapters = isExpanded
                      ? subject.chapters
                      : subject.chapters.slice(0, 5);

                    return (
                      <StaggerItem key={subject.id}>
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                          {/* Subject Header */}
                          <div className={cn(`p-4 border-b`, `${bgColor}`)}>
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  `p-2.5 rounded-lg bg-white shadow-sm bg-background/20`,
                                )}
                              >
                                <Icon className={cn(`h-5 w-5 text-white`)} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  {subject.name}
                                </h3>
                                <p className="text-xs text-white/60">
                                  {subject.nameEn || subject.name}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs text-white"
                              >
                                {subject.chapters.length} টি
                              </Badge>
                            </div>
                          </div>

                          {/* Materials List */}
                          <div className="p-3 space-y-2">
                            {displayedChapters.map((chapter: any) => (
                              <div
                                key={chapter.id}
                                className="group flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">
                                      {chapter.name}
                                    </span>
                                    {chapter.isNew && (
                                      <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                                        নতুন
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span>{chapter.pages || 0} পৃষ্ঠা</span>
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {(chapter.downloads || 0).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* View All Button */}
                          {subject.chapters.length > 5 && (
                            <div className="p-3 pt-0">
                              <Button
                                variant="ghost"
                                className="w-full text-sm group/btn"
                                onClick={() => toggleExpand(cardId)}
                              >
                                {isExpanded ? "কম দেখুন" : "সব দেখুন"}
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                                )}
                              </Button>
                            </div>
                          )}
                        </Card>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
};
