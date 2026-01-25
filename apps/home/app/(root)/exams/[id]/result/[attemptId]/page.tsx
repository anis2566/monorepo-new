"use client";

import { use, useMemo, useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Target,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { parseMathString } from "@/lib/katex";
import { normalizeOptionLabel, getCorrectLetter } from "@/lib/mcq";

interface Props {
  params: Promise<{ id: string; attemptId: string }>;
}

export default function PublicExamResultPage({ params }: Props) {
  const { id, attemptId } = use(params);
  const trpc = useTRPC();

  const { data: result } = useSuspenseQuery(
    trpc.public.exam.getPublicResult.queryOptions({ attemptId }),
  );

  const percentage = (result.score / result.exam.total) * 100;
  const timeSpent = result.duration
    ? `${Math.floor(result.duration / 60)} মিনিট ${result.duration % 60} সেকেন্ড`
    : "N/A";

  const getGrade = (percentage: number) => {
    if (percentage >= 80) return { grade: "A+", color: "text-green-600" };
    if (percentage >= 70) return { grade: "A", color: "text-green-500" };
    if (percentage >= 60) return { grade: "A-", color: "text-blue-600" };
    if (percentage >= 50) return { grade: "B", color: "text-blue-500" };
    if (percentage >= 40) return { grade: "C", color: "text-yellow-600" };
    if (percentage >= 33) return { grade: "D", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">পরীক্ষার ফলাফল</h1>
          <p className="text-lg text-muted-foreground">{result.exam.title}</p>
          <Badge variant="outline" className="text-sm">
            {result.submissionType === "Manual"
              ? "ম্যানুয়াল সাবমিট"
              : result.submissionType === "Auto-TimeUp"
                ? "সময় শেষ"
                : "অটো সাবমিট"}
          </Badge>
        </div>

        {/* Score Card */}
        <Card className="p-8 mb-6 border-2 border-primary/20 shadow-xl">
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">আপনার স্কোর</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-bold text-primary">
                  {result.score}
                </div>
                <div className="text-4xl text-muted-foreground">/</div>
                <div className="text-4xl font-semibold text-muted-foreground">
                  {result.exam.total}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {percentage.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">শতাংশ</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className={`text-3xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.grade}
                </p>
                <p className="text-sm text-muted-foreground">গ্রেড</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">সঠিক উত্তর</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.wrongAnswers}</p>
                <p className="text-sm text-muted-foreground">ভুল উত্তর</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <MinusCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.skippedQuestions}</p>
                <p className="text-sm text-muted-foreground">বাদ দেওয়া</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{timeSpent}</p>
                <p className="text-sm text-muted-foreground">ব্যয়িত সময়</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            পারফরম্যান্স ইনসাইট
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                সর্বোচ্চ স্ট্রিক
              </p>
              <p className="text-2xl font-bold text-primary">
                {result.bestStreak}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">উত্তরের হার</p>
              <p className="text-2xl font-bold text-primary">
                {((result.answeredCount / result.totalQuestions) * 100).toFixed(
                  0,
                )}
                %
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                নির্ভুলতার হার
              </p>
              <p className="text-2xl font-bold text-primary">
                {result.answeredCount > 0
                  ? (
                      (result.correctAnswers / result.answeredCount) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>

        {/* Detailed Review Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-primary" />
            উত্তর পর্যালোচনা
          </h2>
          <ReviewSection questions={result.answerHistory || []} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              হোম পেজে ফিরে যান
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/public/exams/${id}/merit`}>
              <Trophy className="w-4 h-4 mr-2" />
              মেধা তালিকা দেখুন
            </Link>
          </Button>
        </div>

        {/* Participant Info */}
        <Card className="p-6 mt-6 bg-muted/30">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">নাম</p>
              <p className="font-semibold">{result.participant.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">শ্রেণী</p>
              <p className="font-semibold">{result.participant.class}</p>
            </div>
            <div>
              <p className="text-muted-foreground">প্রতিষ্ঠান</p>
              <p className="font-semibold">{result.participant.college}</p>
            </div>
            <div>
              <p className="text-muted-foreground">সাবমিট সময়</p>
              <p className="font-semibold">
                {result.endTime
                  ? formatDistanceToNow(new Date(result.endTime), {
                      locale: bn,
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ListOrdered({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

type FilterTab = "all" | "correct" | "wrong" | "skipped";

function ReviewSection({ questions }: { questions: any[] }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredQuestions = useMemo(() => {
    switch (activeTab) {
      case "correct":
        return questions.filter((q) => q.isCorrect);
      case "wrong":
        return questions.filter(
          (q) => q.isCorrect === false && q.selectedOption,
        );
      case "skipped":
        return questions.filter((q) => !q.selectedOption);
      default:
        return questions;
    }
  }, [questions, activeTab]);

  const counts = {
    all: questions.length,
    correct: questions.filter((q) => q.isCorrect).length,
    wrong: questions.filter((q) => q.isCorrect === false && q.selectedOption)
      .length,
    skipped: questions.filter((q) => !q.selectedOption).length,
  };

  return (
    <div className="space-y-6">
      <Card className="p-1 inline-flex bg-muted/50 border-none shadow-sm">
        <div className="flex items-center gap-1">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            icon={<Target className="w-4 h-4" />}
            label="সব"
            count={counts.all}
          />
          <TabButton
            active={activeTab === "correct"}
            onClick={() => setActiveTab("correct")}
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="সঠিক"
            count={counts.correct}
            variant="success"
          />
          <TabButton
            active={activeTab === "wrong"}
            onClick={() => setActiveTab("wrong")}
            icon={<XCircle className="w-4 h-4" />}
            label="ভুল"
            count={counts.wrong}
            variant="destructive"
          />
          <TabButton
            active={activeTab === "skipped"}
            onClick={() => setActiveTab("skipped")}
            icon={<MinusCircle className="w-4 h-4" />}
            label="বাদ"
            count={counts.skipped}
            variant="muted"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <QuestionReviewCard key={q.mcq.id} question={q} />
        ))}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  variant?: "default" | "success" | "destructive" | "muted";
}) {
  const variantStyles = {
    default: active
      ? "bg-primary text-primary-foreground shadow-md"
      : "hover:bg-background/50 text-muted-foreground",
    success: active
      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
      : "hover:bg-emerald-500/10 text-muted-foreground",
    destructive: active
      ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
      : "hover:bg-rose-500/10 text-muted-foreground",
    muted: active
      ? "bg-muted-foreground text-white shadow-md"
      : "hover:bg-muted-foreground/10 text-muted-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-semibold",
        variantStyles[variant],
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-bold",
          active ? "bg-white/20" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function QuestionReviewCard({ question }: { question: any }) {
  const mcq = question.mcq;
  const isCorrect = question.isCorrect;
  const isSkipped = !question.selectedOption;

  const options = Array.isArray(mcq.options)
    ? mcq.options.reduce((acc: any, opt: string, i: number) => {
        acc[String.fromCharCode(65 + i)] = opt;
        return acc;
      }, {})
    : mcq.options;

  return (
    <Card className="py-6 px-4 border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div>
          <div className="flex-1 space-y-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0",
                isCorrect
                  ? "bg-emerald-100 text-emerald-600"
                  : isSkipped
                    ? "bg-muted text-muted-foreground"
                    : "bg-rose-100 text-rose-600",
              )}
            >
              {question.questionNumber}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-semibold text-xs border-primary/20 bg-primary/5 text-primary"
              >
                {mcq.subject.name}
              </Badge>
              <Badge variant="outline" className="font-medium text-xs">
                {mcq.type}
              </Badge>
              {question.timeSpent && (
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3" />
                  {question.timeSpent}s
                </div>
              )}
            </div>

            <div className="text-lg font-semibold leading-relaxed">
              {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
            </div>

            {mcq.context && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm italic text-muted-foreground border-l-4 border-muted">
                {mcq.isMath ? parseMathString(mcq.context) : mcq.context}
              </div>
            )}

            <div className="grid gap-3">
              {Object.entries(options).map(([key, value]: [string, any]) => {
                const correctLetter = getCorrectLetter(mcq.answer, mcq.options);
                const isSelected =
                  normalizeOptionLabel(question.selectedOption) ===
                  normalizeOptionLabel(key);
                const isCorrectOption =
                  normalizeOptionLabel(correctLetter) ===
                  normalizeOptionLabel(key);

                return (
                  <div
                    key={key}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all flex items-start gap-3",
                      isCorrectOption
                        ? "border-emerald-500 bg-emerald-50/50"
                        : isSelected && !isCorrectOption
                          ? "border-rose-500 bg-rose-50/50"
                          : "border-border bg-background",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm",
                        isCorrectOption
                          ? "bg-emerald-500 text-white"
                          : isSelected
                            ? "bg-rose-500 text-white"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {key}
                    </div>
                    <div className="flex-1 text-sm md:text-base font-medium pt-1">
                      {mcq.isMath ? parseMathString(value) : value}
                    </div>
                    {isCorrectOption && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    )}
                    {isSelected && !isCorrectOption && (
                      <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {mcq.explanation && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  ব্যাখ্যা
                </div>
                <div className="text-sm md:text-base text-indigo-900 leading-relaxed">
                  {mcq.isMath
                    ? parseMathString(mcq.explanation)
                    : mcq.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
