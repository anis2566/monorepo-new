"use client";

import { useState } from "react";
import {
  FileQuestion,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Brain,
  BookOpen,
  Layers,
  CircleDot,
  FileText,
  Loader2,
} from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { cn } from "@workspace/ui/lib/utils";

import { getSubjectBgColor, getSubjectIcon } from "@workspace/utils";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

const questionCategories = [
  {
    id: "mcq",
    title: "MCQ",
    titleBn: "বহুনির্বাচনী প্রশ্ন",
    description: "মেডিকেল, ডেন্টাল, ইঞ্জিনিয়ারিং, বোর্ড",
    icon: CircleDot,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
  },
  {
    id: "cq",
    title: "CQ",
    titleBn: "সৃজনশীল প্রশ্ন",
    description: "টপিকভিত্তিক বোর্ড প্রশ্ন",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
  },
  {
    id: "knowledge",
    title: "জ্ঞানমূলক",
    titleBn: "Knowledge Based",
    description: "জ্ঞানমূলক প্রশ্ন ও উত্তর",
    icon: Lightbulb,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600",
  },
  {
    id: "comprehension-mcq",
    title: "অনুধাবনমূলক",
    titleBn: "Comprehension MCQ",
    description: "অনুধাবনমূলক প্রশ্ন ও উত্তর",
    icon: Brain,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600",
  },
];

export const QuestionBankServices = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    questionCategories[0]?.id,
  );
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const trpc = useTRPC();

  // Fetch all question banks
  const { data: mcqSubjects, isLoading: mcqLoading } = useQuery(
    trpc.home.service.getMcqQuestionBank.queryOptions(),
  );

  const { data: cqSubjects, isLoading: cqLoading } = useQuery(
    trpc.home.service.getCqQuestionBank.queryOptions(),
  );

  const { data: cognitiveSubjects, isLoading: cognitiveLoading } = useQuery(
    trpc.home.service.getCognitiveQuestionBank.queryOptions(),
  );

  const { data: perceptualSubjects, isLoading: perceptualLoading } = useQuery(
    trpc.home.service.getPerceptualQuestionBank.queryOptions(),
  );

  // Get current data based on selected category
  const getCurrentData = () => {
    switch (selectedCategory) {
      case "mcq":
        return { subjects: mcqSubjects, isLoading: mcqLoading };
      case "cq":
        return { subjects: cqSubjects, isLoading: cqLoading };
      case "knowledge":
        return { subjects: cognitiveSubjects, isLoading: cognitiveLoading };
      case "comprehension-mcq":
        return { subjects: perceptualSubjects, isLoading: perceptualLoading };
      default:
        return { subjects: mcqSubjects, isLoading: mcqLoading };
    }
  };

  const { subjects, isLoading } = getCurrentData();

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const currentCategory = questionCategories.find(
    (c) => c.id === selectedCategory,
  )!;

  // Calculate total chapters
  const totalChapters =
    subjects?.reduce((acc, subject) => acc + subject.chapters.length, 0) || 0;

  // Calculate total questions across all subjects
  const totalQuestions =
    subjects?.reduce(
      (acc, subject) => acc + (subject.totalQuestions || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <FadeUp>
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileQuestion className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  প্রশ্ন ব্যাংক
                </h1>
                <p className="text-white/80 text-sm">Question Bank</p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl mb-6">
              বিষয়, অধ্যায় ও টপিক ভিত্তিক সাজানো প্রশ্ন সংগ্রহ - MCQ, CQ,
              জ্ঞানমূলক ও অনুধাবনমূলক
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                <Layers className="h-4 w-4 mr-2" />
                {questionCategories.length} ক্যাটাগরি
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                <BookOpen className="h-4 w-4 mr-2" />
                {subjects?.length || 0} বিষয়
              </Badge>
              {totalChapters > 0 && (
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                  {totalChapters} অধ্যায়
                </Badge>
              )}
              {totalQuestions > 0 && (
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-2">
                  {totalQuestions} প্রশ্ন
                </Badge>
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Category Tabs */}
      <FadeUp delay={0.1}>
        <div className="container mx-auto px-4 -mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {questionCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className={cn(
                  "flex-shrink-0 gap-2 rounded-full px-4 py-2 h-auto transition-all",
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg border-0`
                    : "bg-white",
                )}
                onClick={() => {
                  setSelectedCategory(category.id);
                  // Reset expanded states when switching categories
                  setExpandedSubjects([]);
                  setExpandedChapters([]);
                }}
              >
                <category.icon className="h-4 w-4" />
                <span className="font-medium">{category.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Selected Category Header */}
      <FadeUp delay={0.15}>
        <div className="container mx-auto px-4 py-6">
          <div
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border",
              currentCategory.bgColor,
              currentCategory.borderColor,
            )}
          >
            <div
              className={cn(
                "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
                currentCategory.color,
              )}
            >
              <currentCategory.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {currentCategory.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentCategory.description}
              </p>
            </div>
            {totalQuestions > 0 && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                {totalQuestions} প্রশ্ন
              </Badge>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {currentCategory.title} প্রশ্ন ব্যাংক লোড হচ্ছে...
            </p>
          </div>
        </div>
      )}

      {/* Subjects Accordion */}
      {!isLoading && subjects && (
        <div className="container mx-auto px-4 pb-8">
          <StaggerContainer className="space-y-4">
            {subjects.map((subject) => {
              const Icon = getSubjectIcon(subject.name);
              const bgColor = getSubjectBgColor(subject.name);

              return (
                <StaggerItem key={subject.id}>
                  <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                    {/* Subject Header */}
                    <Collapsible
                      open={expandedSubjects.includes(subject.id)}
                      onOpenChange={() => toggleSubject(subject.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div
                          className={cn(
                            "flex items-center gap-4 p-4 cursor-pointer transition-colors",
                            bgColor,
                          )}
                        >
                          <div className="p-3 rounded-xl bg-background/20 shadow-sm">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-lg text-white">
                              {subject.name}
                            </h3>
                            {subject.totalQuestions > 0 && (
                              <p className="text-sm text-white/80">
                                {subject.totalQuestions} টি প্রশ্ন
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="mr-2 hidden md:flex"
                          >
                            {subject.chapters.length} অধ্যায়
                          </Badge>
                          {expandedSubjects.includes(subject.id) ? (
                            <ChevronDown className="h-5 w-5 text-white/80" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-white/80" />
                          )}
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t bg-muted/20">
                          {subject.chapters.length > 0 ? (
                            subject.chapters.map((chapter) => {
                              const chapterKey = `${subject.id}-${chapter.id}`;
                              return (
                                <Collapsible
                                  key={chapter.id}
                                  open={expandedChapters.includes(chapterKey)}
                                  onOpenChange={() => toggleChapter(chapterKey)}
                                >
                                  <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center gap-3 p-4 pl-8 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors">
                                      <div className="p-2 rounded-lg bg-muted">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1 text-left">
                                        <span className="font-medium text-foreground">
                                          {chapter.name}
                                        </span>
                                        {chapter.totalQuestions > 0 && (
                                          <p className="text-xs text-muted-foreground">
                                            {chapter.totalQuestions} টি প্রশ্ন
                                          </p>
                                        )}
                                      </div>
                                      <Badge variant="outline" className="mr-2">
                                        {chapter.topics.length} টপিক
                                      </Badge>
                                      {expandedChapters.includes(chapterKey) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="bg-muted/30 border-t">
                                      {chapter.topics.length > 0 ? (
                                        chapter.topics.map((topic) => (
                                          <div
                                            key={topic.id}
                                            className="group flex items-center gap-3 p-3 pl-16 border-b last:border-b-0 hover:bg-background/80 cursor-pointer transition-colors"
                                            onClick={() => {
                                              // Handle topic click - navigate to questions
                                              console.log(
                                                `Navigate to ${selectedCategory} questions for topic: ${topic.id}`,
                                              );
                                            }}
                                          >
                                            <div
                                              className={cn(
                                                "w-2 h-2 rounded-full",
                                                currentCategory.textColor.replace(
                                                  "text-",
                                                  "bg-",
                                                ),
                                              )}
                                            />
                                            <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors">
                                              {topic.name}
                                            </span>
                                            <Badge
                                              variant="secondary"
                                              className="text-xs opacity-70 group-hover:opacity-100"
                                            >
                                              {topic.questionCount} প্রশ্ন
                                            </Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-4 pl-16 text-sm text-muted-foreground">
                                          কোনো টপিক নেই
                                        </div>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })
                          ) : (
                            <div className="p-4 pl-8 text-sm text-muted-foreground">
                              কোনো অধ্যায় নেই
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Empty State */}
          {subjects.length === 0 && (
            <Card className="p-12 text-center">
              <currentCategory.icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                কোনো {currentCategory.title} প্রশ্ন পাওয়া যায়নি
              </h3>
              <p className="text-sm text-muted-foreground">
                এই মুহূর্তে {currentCategory.title} প্রশ্ন ব্যাংকে কোনো প্রশ্ন
                নেই।
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
