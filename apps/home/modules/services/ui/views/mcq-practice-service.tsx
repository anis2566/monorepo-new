"use client";

import { useState, useMemo } from "react";
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
  Dna,
  Beaker,
  Atom,
  Calculator,
  Globe,
  X,
  Settings2,
  Clock,
  HelpCircle,
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

// Mock data
const subjectsData = [
  {
    id: "biology",
    name: "জীববিজ্ঞান",
    chapters: [
      {
        id: "bio-ch1",
        name: "কোষ ও কোষের গঠন",
        topics: [
          { id: "bio-ch1-t1", name: "কোষের আবিষ্কার", questionCount: 25 },
          { id: "bio-ch1-t2", name: "কোষের গঠন", questionCount: 30 },
          { id: "bio-ch1-t3", name: "কোষ বিভাজন", questionCount: 20 },
        ],
      },
      {
        id: "bio-ch2",
        name: "জীবের পরিবেশ",
        topics: [
          { id: "bio-ch2-t1", name: "বাস্তুতন্ত্র", questionCount: 18 },
          { id: "bio-ch2-t2", name: "খাদ্য শৃঙ্খল", questionCount: 22 },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "রসায়ন",
    chapters: [
      {
        id: "chem-ch1",
        name: "পরমাণুর গঠন",
        topics: [
          { id: "chem-ch1-t1", name: "ইলেকট্রন বিন্যাস", questionCount: 20 },
          { id: "chem-ch1-t2", name: "আইসোটোপ", questionCount: 15 },
        ],
      },
    ],
  },
  {
    id: "physics",
    name: "পদার্থবিজ্ঞান",
    chapters: [
      {
        id: "phy-ch1",
        name: "গতিবিদ্যা",
        topics: [
          { id: "phy-ch1-t1", name: "সরল রৈখিক গতি", questionCount: 30 },
          { id: "phy-ch1-t2", name: "নিউটনের সূত্র", questionCount: 35 },
        ],
      },
    ],
  },
  {
    id: "math",
    name: "উচ্চতর গণিত",
    chapters: [
      {
        id: "math-ch1",
        name: "বীজগণিত",
        topics: [
          { id: "math-ch1-t1", name: "সমীকরণ", questionCount: 40 },
          { id: "math-ch1-t2", name: "অসমতা", questionCount: 25 },
        ],
      },
    ],
  },
  {
    id: "english",
    name: "ইংরেজি",
    chapters: [
      {
        id: "eng-ch1",
        name: "Grammar",
        topics: [
          { id: "eng-ch1-t1", name: "Tense", questionCount: 35 },
          { id: "eng-ch1-t2", name: "Voice", questionCount: 25 },
        ],
      },
    ],
  },
];

export const McqPracticeService = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState("20");
  const [timeLimit, setTimeLimit] = useState("30");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const availableChapters = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return subjectsData
      .filter((s) => selectedSubjects.includes(s.id))
      .flatMap((s) =>
        s.chapters.map((ch) => ({
          ...ch,
          subjectId: s.id,
          subjectName: s.name,
        })),
      );
  }, [selectedSubjects]);

  const availableTopics = useMemo(() => {
    if (selectedChapters.length === 0) return [];
    return availableChapters
      .filter((ch) => selectedChapters.includes(ch.id))
      .flatMap((ch) =>
        ch.topics.map((t) => ({
          ...t,
          chapterId: ch.id,
          chapterName: ch.name,
        })),
      );
  }, [selectedChapters, availableChapters]);

  const totalQuestionsAvailable = useMemo(() => {
    if (selectedTopics.length > 0) {
      return availableTopics
        .filter((t) => selectedTopics.includes(t.id))
        .reduce((sum, t) => sum + t.questionCount, 0);
    }
    if (selectedChapters.length > 0) {
      return availableChapters
        .filter((ch) => selectedChapters.includes(ch.id))
        .flatMap((ch) => ch.topics)
        .reduce((sum, t) => sum + t.questionCount, 0);
    }
    if (selectedSubjects.length > 0) {
      return subjectsData
        .filter((s) => selectedSubjects.includes(s.id))
        .flatMap((s) => s.chapters)
        .flatMap((ch) => ch.topics)
        .reduce((sum, t) => sum + t.questionCount, 0);
    }
    return 0;
  }, [
    selectedSubjects,
    selectedChapters,
    selectedTopics,
    availableChapters,
    availableTopics,
  ]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const newSelection = prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId];

      if (!newSelection.includes(subjectId)) {
        const subjectChapters =
          subjectsData.find((s) => s.id === subjectId)?.chapters || [];
        const chapterIds = subjectChapters.map((ch) => ch.id);
        setSelectedChapters((prev) =>
          prev.filter((id) => !chapterIds.includes(id)),
        );
        const topicIds = subjectChapters.flatMap((ch) =>
          ch.topics.map((t) => t.id),
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
        const chapter = availableChapters.find((ch) => ch.id === chapterId);
        const topicIds = chapter?.topics.map((t) => t.id) || [];
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
    const subject = subjectsData.find((s) => s.id === subjectId);
    if (!subject) return;
    const chapterIds = subject.chapters.map((ch) => ch.id);
    setSelectedChapters((prev) => [...new Set([...prev, ...chapterIds])]);
  };

  const selectAllTopicsForChapter = (chapterId: string) => {
    const chapter = availableChapters.find((ch) => ch.id === chapterId);
    if (!chapter) return;
    const topicIds = chapter.topics.map((t) => t.id);
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
              {subjectsData.length} বিষয়
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0"
            >
              <Layers className="w-3 h-3 mr-1" />
              {subjectsData.reduce((sum, s) => sum + s.chapters.length, 0)}{" "}
              অধ্যায়
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              ৫০০+ প্রশ্ন
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
                const subject = subjectsData.find((s) => s.id === id);
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
                const chapter = availableChapters.find((ch) => ch.id === id);
                return (
                  chapter && (
                    <Badge key={id} variant="outline" className="gap-1">
                      {chapter.name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => toggleChapter(id)}
                      />
                    </Badge>
                  )
                );
              })}
              {selectedTopics.map((id) => {
                const topic = availableTopics.find((t) => t.id === id);
                return (
                  topic && (
                    <Badge
                      key={id}
                      variant="outline"
                      className="gap-1 bg-muted"
                    >
                      {topic.name}
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
              {subjectsData.map((subject) => {
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
                        {subject.chapters.map((chapter) => {
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
                                  {chapter.topics.map((topic) => {
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
                পরীক্ষার সেটিংস
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">প্রশ্ন সংখ্যা</Label>
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
                    সময়সীমা (মিনিট)
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
                  <Label className="text-sm">নেগেটিভ মার্কিং</Label>
                  <Switch
                    checked={negativeMarking}
                    onCheckedChange={setNegativeMarking}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between mb-1">
                    <span>নির্বাচিত বিষয়:</span>
                    <span className="font-medium text-foreground">
                      {selectedSubjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>নির্বাচিত অধ্যায়:</span>
                    <span className="font-medium text-foreground">
                      {selectedChapters.length}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>নির্বাচিত টপিক:</span>
                    <span className="font-medium text-foreground">
                      {selectedTopics.length}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border mt-2">
                    <span>মোট প্রশ্ন উপলব্ধ:</span>
                    <span className="font-semibold text-primary">
                      {totalQuestionsAvailable}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  disabled={!canStartPractice}
                >
                  <Play className="w-5 h-5" />
                  প্র্যাকটিস শুরু করুন
                </Button>

                {!canStartPractice && selectedSubjects.length > 0 && (
                  <p className="text-xs text-destructive mt-2 text-center">
                    পর্যাপ্ত প্রশ্ন নেই। কম প্রশ্ন নির্বাচন করুন বা আরও টপিক যোগ
                    করুন।
                  </p>
                )}

                {selectedSubjects.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    শুরু করতে অন্তত একটি বিষয় নির্বাচন করুন
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
