"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Target,
  BookOpen,
  Layers,
  Play,
  ChevronDown,
  ChevronRight,
  X,
  Settings2,
  Clock,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { getSubjectBgColor, getSubjectIcon } from "@workspace/utils";
import { useTRPC } from "@/trpc/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import TakeMcqPractice from "./take-mcq-practice-view";
import PracticeResultView from "./practice-result-view";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("mcq-practice-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("mcq-practice-session-id", sessionId);
  }
  return sessionId;
}

export const McqPracticeService = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  const attemptId = searchParams.get("attemptId");
  const demoExamId = searchParams.get("demoExamId");

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState("20");
  const [timeLimit, setTimeLimit] = useState("30");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  // Fetch subjects with chapters from tRPC
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery(
    trpc.home.demoExam.getSubjectsWithChapters.queryOptions()
  );

  const createSessionMutation = useMutation(
    trpc.home.demoExam.createPracticeSession.mutationOptions({
      onSuccess: (data) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("attemptId", data.attemptId);
        params.set("demoExamId", data.demoExamId);
        router.push(`/services/mcq-practice?${params.toString()}`);
      },
      onError: (error) => {
        toast.error("Failed to create practice session");
        console.error(error);
      },
    })
  );

  const availableChapters = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return subjects
      .filter((s: any) => selectedSubjects.includes(s.id))
      .flatMap((s: any) =>
        s.chapters.map((ch: any) => ({
          ...ch,
          subjectId: s.id,
          subjectName: s.name,
        })),
      );
  }, [selectedSubjects, subjects]);

  const availableTopics = useMemo(() => {
    if (selectedChapters.length === 0) return [];
    return availableChapters
      .filter((ch: any) => selectedChapters.includes(ch.id))
      .flatMap((ch: any) =>
        ch.topics?.map((t: any) => ({
          ...t,
          chapterId: ch.id,
          chapterName: ch.name,
        })) || [],
      );
  }, [selectedChapters, availableChapters]);

  const totalQuestionsAvailable = useMemo(() => {
    if (selectedTopics.length > 0) {
      return availableTopics
        .filter((t: any) => selectedTopics.includes(t.id))
        .reduce((sum: number, t: any) => sum + (t.questionCount || 0), 0);
    }
    if (selectedChapters.length > 0) {
      return availableChapters
        .filter((ch: any) => selectedChapters.includes(ch.id))
        .reduce((sum: number, ch: any) => sum + (ch.questionCount || 0), 0);
    }
    if (selectedSubjects.length > 0) {
      return subjects
        .filter((s: any) => selectedSubjects.includes(s.id))
        .reduce((sum: number, s: any) => sum + (s.questionCount || 0), 0);
    }
    return 0;
  }, [
    selectedSubjects,
    selectedChapters,
    selectedTopics,
    availableChapters,
    availableTopics,
    subjects,
  ]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const newSelection = prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId];

      if (!newSelection.includes(subjectId)) {
        const subjectChapters =
          subjects.find((s: any) => s.id === subjectId)?.chapters || [];
        const chapterIds = subjectChapters.map((ch: any) => ch.id);
        setSelectedChapters((prev) =>
          prev.filter((id) => !chapterIds.includes(id)),
        );
        const topicIds = subjectChapters.flatMap((ch: any) =>
          (ch.topics || []).map((t: any) => t.id),
        );
        setSelectedTopics((prev) =>
          prev.filter((id) => !topicIds.includes(id)),
        );
      }

      return newSelection;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setSelectedChapters((prev) => {
      const newSelection = prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];

      if (!newSelection.includes(chapterId)) {
        const chapter = availableChapters.find((ch: any) => ch.id === chapterId);
        const topicIds = chapter?.topics?.map((t: any) => t.id) || [];
        setSelectedTopics((prev) =>
          prev.filter((id) => !topicIds.includes(id)),
        );
      }

      return newSelection;
    });
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  const toggleExpandSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const toggleExpandChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const selectAllChaptersForSubject = (subjectId: string) => {
    const subject = subjects.find((s: any) => s.id === subjectId);
    if (!subject) return;
    const chapterIds = subject.chapters.map((ch: any) => ch.id);
    setSelectedChapters((prev) => [...new Set([...prev, ...chapterIds])]);
  };

  const selectAllTopicsForChapter = (chapterId: string) => {
    const chapter = availableChapters.find((ch: any) => ch.id === chapterId);
    if (!chapter) return;
    const topicIds = chapter.topics?.map((t: any) => t.id) || [];
    setSelectedTopics((prev) => [...new Set([...prev, ...topicIds])]);
  };

  const clearAllSelections = () => {
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setSelectedTopics([]);
  };

  const canStartPractice =
    selectedSubjects.length > 0 &&
    totalQuestionsAvailable >= parseInt(questionCount);

  const handleStartPractice = () => {
    if (!canStartPractice) return;

    createSessionMutation.mutate({
      sessionId: getSessionId(),
      selectedSubjects,
      selectedChapters,
      selectedTopics,
      questionCount: parseInt(questionCount),
      timeLimit: parseInt(timeLimit),
      shuffleQuestions,
      hasNegativeMark: negativeMarking,
    });
  };

  // If result view, render PracticeResultView
  if (searchParams.get("view") === "result" && attemptId) {
    return <PracticeResultView attemptId={attemptId} />;
  }

  // If ongoing practice session, render TakeMcqPractice
  if (attemptId && demoExamId) {
    return <TakeMcqPractice attemptId={attemptId} demoExamId={demoExamId} />;
  }

  if (subjectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading subjects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MCQ প্র্যাকটিস</h1>
              <p className="text-purple-100 text-sm">
                নিজের মতো করে প্র্যাকটিস করুন
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              {subjects.length} বিষয়
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0"
            >
              <Layers className="w-3 h-3 mr-1" />
              {subjects.reduce((sum: number, s: any) => sum + s.chapters.length, 0)}{" "}
              অধ্যায়
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              {subjects.reduce((sum: number, s: any) => sum + (s.questionCount || 0), 0)}+ প্রশ্ন
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Selection Summary */}
        {(selectedSubjects.length > 0 ||
          selectedChapters.length > 0 ||
          selectedTopics.length > 0) && (
            <Card className="p-4 mb-6 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">নির্বাচিত আইটেম</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSelections}
                  className="text-destructive h-8"
                >
                  <X className="w-4 h-4 mr-1" />
                  সব মুছুন
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((id) => {
                  const subject = subjects.find((s: any) => s.id === id);
                  return (
                    subject && (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {subject.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleSubject(id)}
                        />
                      </Badge>
                    )
                  );
                })}
                {selectedChapters.map((id) => {
                  const chapter = availableChapters.find((ch: any) => ch.id === id);
                  return (
                    chapter && (
                      <Badge key={id} variant="outline" className="gap-1">
                        {(chapter as any).name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleChapter(id)}
                        />
                      </Badge>
                    )
                  );
                })}
                {selectedTopics.map((id) => {
                  const topic = availableTopics.find((t: any) => t.id === id);
                  return (
                    topic && (
                      <Badge
                        key={id}
                        variant="outline"
                        className="gap-1 bg-muted"
                      >
                        {(topic as any).name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleTopic(id)}
                        />
                      </Badge>
                    )
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  মোট প্রশ্ন উপলব্ধ:{" "}
                  <span className="font-semibold text-foreground">
                    {totalQuestionsAvailable}
                  </span>
                </p>
              </div>
            </Card>
          )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              বিষয় নির্বাচন করুন
            </h2>

            <div className="space-y-3">
              {subjects.map((subject: any) => {
                const isSelected = selectedSubjects.includes(subject.id);
                const isExpanded = expandedSubjects.includes(subject.id);
                const Icon = getSubjectIcon(subject.name);
                const bgColor = getSubjectBgColor(subject.name);

                return (
                  <Card
                    key={subject.id}
                    className={cn(
                      "overflow-hidden transition-all",
                      isSelected && `ring-2 ring-primary`,
                    )}
                  >
                    {/* Subject Header */}
                    <div className={cn("flex items-center gap-3 p-4", bgColor)}>
                      <Checkbox
                        id={subject.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleSubject(subject.id)}
                      />
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor={subject.id}
                          className="font-medium text-white cursor-pointer"
                        >
                          {subject.name}
                        </Label>
                        <p className="hidden md:flex text-xs text-white/80">
                          {subject.chapters.length} অধ্যায়
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs h-7 bg-white/20 hover:bg-white/30 text-white border-0"
                            onClick={() =>
                              selectAllChaptersForSubject(subject.id)
                            }
                          >
                            সব নির্বাচন
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => toggleExpandSubject(subject.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Chapters */}
                    {isExpanded && isSelected && (
                      <div className="border-t border-border">
                        {subject.chapters.map((chapter: any) => {
                          const isChapterSelected = selectedChapters.includes(
                            chapter.id,
                          );
                          const isChapterExpanded = expandedChapters.includes(
                            chapter.id,
                          );

                          return (
                            <div
                              key={chapter.id}
                              className="border-b border-border last:border-0"
                            >
                              <div className="flex items-center gap-3 p-3 pl-8 hover:bg-muted/50">
                                <Checkbox
                                  id={chapter.id}
                                  checked={isChapterSelected}
                                  onCheckedChange={() =>
                                    toggleChapter(chapter.id)
                                  }
                                />
                                <Label
                                  htmlFor={chapter.id}
                                  className="flex-1 text-sm cursor-pointer"
                                >
                                  {chapter.name}
                                </Label>
                                <span className="hidden md:flex text-xs text-muted-foreground">
                                  {chapter.topics.length} টপিক
                                </span>
                                <div className="flex items-center gap-1">
                                  {isChapterSelected && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-6 px-2 text-primary hover:text-primary hover:bg-primary/10"
                                      onClick={() =>
                                        selectAllTopicsForChapter(chapter.id)
                                      }
                                    >
                                      সব
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      toggleExpandChapter(chapter.id)
                                    }
                                  >
                                    {isChapterExpanded ? (
                                      <ChevronDown className="w-3 h-3" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Topics */}
                              {isChapterExpanded && isChapterSelected && (
                                <div className="bg-muted/30 py-2">
                                  {chapter.topics.map((topic: any) => {
                                    const isTopicSelected =
                                      selectedTopics.includes(topic.id);

                                    return (
                                      <div
                                        key={topic.id}
                                        className="flex items-center gap-3 px-4 py-2 pl-14 hover:bg-muted/50"
                                      >
                                        <Checkbox
                                          id={topic.id}
                                          checked={isTopicSelected}
                                          onCheckedChange={() =>
                                            toggleTopic(topic.id)
                                          }
                                        />
                                        <Label
                                          htmlFor={topic.id}
                                          className="flex-1 text-sm cursor-pointer"
                                        >
                                          {topic.name}
                                        </Label>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {topic.questionCount} প্রশ্ন
                                        </Badge>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            <Card className="p-4 sticky top-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Settings2 className="w-5 h-5 text-primary" />
                Exam Settings
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Question Count</Label>
                  <Select
                    value={questionCount}
                    onValueChange={setQuestionCount}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time Limit (Minutes)
                  </Label>
                  <Select value={timeLimit} onValueChange={setTimeLimit}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="45">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Negative Marking</Label>
                  <Switch
                    checked={negativeMarking}
                    onCheckedChange={setNegativeMarking}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Shuffle Questions</Label>
                  <Switch
                    checked={shuffleQuestions}
                    onCheckedChange={setShuffleQuestions}
                  />
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  disabled={!canStartPractice || createSessionMutation.isPending}
                  onClick={handleStartPractice}
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Session...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
