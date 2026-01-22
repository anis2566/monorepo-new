"use client";

import {
  BookOpen,
  FileText,
  Download,
  Eye,
  ChevronRight,
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
    subjects: [
      {
        id: 1,
        name: "জীববিজ্ঞান",
        nameEn: "Biology",
        icon: Dna,
        color: "text-green-600",
        bgColor: "bg-green-50",
        materials: [
          {
            id: 1,
            title: "কোষ ও কোষের গঠন",
            pages: 45,
            downloads: 1250,
            isNew: true,
          },
          {
            id: 2,
            title: "জীবনীশক্তি",
            pages: 38,
            downloads: 980,
            isNew: false,
          },
          { id: 3, title: "অণুজীব", pages: 52, downloads: 1100, isNew: false },
        ],
      },
      {
        id: 2,
        name: "রসায়ন",
        nameEn: "Chemistry",
        icon: Beaker,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        materials: [
          {
            id: 1,
            title: "পরমাণুর গঠন",
            pages: 42,
            downloads: 1450,
            isNew: true,
          },
          {
            id: 2,
            title: "রাসায়নিক বন্ধন",
            pages: 55,
            downloads: 1200,
            isNew: false,
          },
          {
            id: 3,
            title: "জৈব রসায়ন",
            pages: 48,
            downloads: 890,
            isNew: false,
          },
        ],
      },
      {
        id: 3,
        name: "পদার্থবিজ্ঞান",
        nameEn: "Physics",
        icon: Atom,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        materials: [
          {
            id: 1,
            title: "ভেক্টর ও স্কেলার",
            pages: 35,
            downloads: 1680,
            isNew: false,
          },
          {
            id: 2,
            title: "গতিবিদ্যা",
            pages: 60,
            downloads: 1520,
            isNew: true,
          },
          {
            id: 3,
            title: "কাজ, শক্তি ও ক্ষমতা",
            pages: 44,
            downloads: 1100,
            isNew: false,
          },
        ],
      },
      {
        id: 4,
        name: "উচ্চতর গণিত",
        nameEn: "Higher Math",
        icon: Calculator,
        color: "text-red-600",
        bgColor: "bg-red-50",
        materials: [
          {
            id: 1,
            title: "বিন্যাস ও সমাবেশ",
            pages: 40,
            downloads: 1350,
            isNew: false,
          },
          { id: 2, title: "সম্ভাবনা", pages: 38, downloads: 1100, isNew: true },
        ],
      },
      {
        id: 5,
        name: "ইংরেজি",
        nameEn: "English",
        icon: Globe,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        materials: [
          {
            id: 1,
            title: "Grammar Essentials",
            pages: 65,
            downloads: 2100,
            isNew: true,
          },
          {
            id: 2,
            title: "Vocabulary Builder",
            pages: 48,
            downloads: 1800,
            isNew: false,
          },
        ],
      },
    ],
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
    subjects: [
      {
        id: 1,
        name: "জীববিজ্ঞান",
        nameEn: "Biology",
        icon: Dna,
        color: "text-green-600",
        bgColor: "bg-green-50",
        materials: [
          {
            id: 1,
            title: "১ম অধ্যায় - দাগানো",
            pages: 28,
            downloads: 2450,
            isNew: true,
          },
          {
            id: 2,
            title: "২য় অধ্যায় - দাগানো",
            pages: 32,
            downloads: 2100,
            isNew: false,
          },
          {
            id: 3,
            title: "৩য় অধ্যায় - দাগানো",
            pages: 35,
            downloads: 1980,
            isNew: false,
          },
        ],
      },
      {
        id: 2,
        name: "রসায়ন",
        nameEn: "Chemistry",
        icon: Beaker,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        materials: [
          {
            id: 1,
            title: "১ম অধ্যায় - দাগানো",
            pages: 30,
            downloads: 2200,
            isNew: false,
          },
          {
            id: 2,
            title: "২য় অধ্যায় - দাগানো",
            pages: 28,
            downloads: 1950,
            isNew: true,
          },
        ],
      },
      {
        id: 3,
        name: "পদার্থবিজ্ঞান",
        nameEn: "Physics",
        icon: Atom,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        materials: [
          {
            id: 1,
            title: "১ম অধ্যায় - দাগানো",
            pages: 25,
            downloads: 2650,
            isNew: true,
          },
          {
            id: 2,
            title: "২য় অধ্যায় - দাগানো",
            pages: 30,
            downloads: 2400,
            isNew: false,
          },
          {
            id: 3,
            title: "৩য় অধ্যায় - দাগানো",
            pages: 32,
            downloads: 2100,
            isNew: false,
          },
        ],
      },
      {
        id: 4,
        name: "উচ্চতর গণিত",
        nameEn: "Higher Math",
        icon: Calculator,
        color: "text-red-600",
        bgColor: "bg-red-50",
        materials: [
          {
            id: 1,
            title: "সেট ও ফাংশন - দাগানো",
            pages: 22,
            downloads: 1850,
            isNew: false,
          },
          {
            id: 2,
            title: "বীজগাণিতিক রাশি - দাগানো",
            pages: 26,
            downloads: 1700,
            isNew: true,
          },
        ],
      },
    ],
  },
];

export const MaterialsServices = () => {
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
                    s.subjects.reduce((a, sub) => a + sub.materials.length, 0),
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
                  {section.subjects.map((subject) => {
                    const Icon = getSubjectIcon(subject.name);
                    const bgColor = getSubjectBgColor(subject.name);
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
                                  {subject.nameEn}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs text-white"
                              >
                                {subject.materials.length} টি
                              </Badge>
                            </div>
                          </div>

                          {/* Materials List */}
                          <div className="p-3 space-y-2">
                            {subject.materials.map((material) => (
                              <div
                                key={material.id}
                                className="group flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">
                                      {material.title}
                                    </span>
                                    {material.isNew && (
                                      <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                                        নতুন
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span>{material.pages} পৃষ্ঠা</span>
                                    <span className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      {material.downloads.toLocaleString()}
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
                          <div className="p-3 pt-0">
                            <Button
                              variant="ghost"
                              className="w-full text-sm group/btn"
                            >
                              সব দেখুন
                              <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
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
