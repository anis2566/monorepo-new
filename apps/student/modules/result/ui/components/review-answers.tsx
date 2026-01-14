"use client";

import { Card } from "@workspace/ui/components/card";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Target,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@workspace/ui/lib/utils";
import type { ReviewQuestion, FilterTab } from "@/types/result";
import { parseMathString } from "@/lib/katex";

interface ReviewAnswersSectionProps {
  reviewQuestions: ReviewQuestion[];
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
}

export function secondsToDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

export const ReviewAnswersSection = ({
  reviewQuestions,
  correctCount,
  wrongCount,
  skippedCount,
}: ReviewAnswersSectionProps) => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Filter questions based on active tab
  const filteredQuestions = useMemo(() => {
    switch (activeTab) {
      case "correct":
        return reviewQuestions.filter((q) => q.isCorrect);
      case "wrong":
        return reviewQuestions.filter((q) => !q.isCorrect && q.selectedOption);
      case "skipped":
        return reviewQuestions.filter((q) => !q.selectedOption);
      case "all":
      default:
        return reviewQuestions;
    }
  }, [reviewQuestions, activeTab]);

  // Count statistics for tabs
  const tabCounts = {
    all: reviewQuestions.length,
    correct: correctCount,
    wrong: wrongCount,
    skipped: skippedCount,
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Answers</h2>
      </div>

      {/* Filter Tabs */}
      <Card className="p-1">
        <div className="flex items-center gap-1">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            icon={<Target className="w-4 h-4" />}
            label="All Questions"
            count={tabCounts.all}
          />
          <TabButton
            active={activeTab === "correct"}
            onClick={() => setActiveTab("correct")}
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Correct"
            count={tabCounts.correct}
            variant="success"
          />
          <TabButton
            active={activeTab === "wrong"}
            onClick={() => setActiveTab("wrong")}
            icon={<XCircle className="w-4 h-4" />}
            label="Wrong"
            count={tabCounts.wrong}
            variant="destructive"
          />
          <TabButton
            active={activeTab === "skipped"}
            onClick={() => setActiveTab("skipped")}
            icon={<MinusCircle className="w-4 h-4" />}
            label="Skipped"
            count={tabCounts.skipped}
            variant="muted"
          />
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No questions found in this category
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  variant?: "default" | "success" | "destructive" | "muted";
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  variant = "default",
}: TabButtonProps) {
  const variantStyles = {
    default: active
      ? "bg-primary text-primary-foreground"
      : "hover:bg-muted text-foreground",
    success: active
      ? "bg-success text-success-foreground"
      : "hover:bg-success/10 text-foreground",
    destructive: active
      ? "bg-destructive text-destructive-foreground"
      : "hover:bg-destructive/10 text-foreground",
    muted: active
      ? "bg-muted text-foreground"
      : "hover:bg-muted/50 text-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
        variantStyles[variant]
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-semibold",
          active
            ? "bg-background/20"
            : variant === "success"
              ? "bg-success/10 text-success"
              : variant === "destructive"
                ? "bg-destructive/10 text-destructive"
                : variant === "muted"
                  ? "bg-muted text-muted-foreground"
                  : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

// Question Card Component
interface QuestionCardProps {
  question: ReviewQuestion;
}

function QuestionCard({ question }: QuestionCardProps) {
  const isCorrect = question.isCorrect;
  const isSkipped = !question.selectedOption;

  // Convert options to Record format if it's an array
  const optionsRecord: Record<string, string> = Array.isArray(
    question.mcq.options
  )
    ? question.mcq.options.reduce(
        (acc, option, index) => {
          const key = String.fromCharCode(65 + index); // A, B, C, D...
          acc[key] = option;
          return acc;
        },
        {} as Record<string, string>
      )
    : question.mcq.options;

  // Convert statements to Record format if it's an array
  const statementsRecord: Record<string, string> | null = question.mcq
    .statements
    ? Array.isArray(question.mcq.statements)
      ? question.mcq.statements.reduce(
          (acc, statement, index) => {
            acc[`Statement ${index + 1}`] = statement;
            return acc;
          },
          {} as Record<string, string>
        )
      : question.mcq.statements
    : null;

  return (
    <Card className="p-6">
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold",
            isCorrect
              ? "bg-success/10 text-success"
              : isSkipped
                ? "bg-muted text-muted-foreground"
                : "bg-destructive/10 text-destructive"
          )}
        >
          {question.questionNumber}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
              {question.mcq.subject}
            </span>
            <span className="text-xs text-muted-foreground">
              {question.mcq.type}
            </span>
            {question.timeSpent && (
              <span className="text-xs text-muted-foreground ml-auto">
                <Clock className="w-3 h-3 inline mr-1" />
                {secondsToDuration(question.timeSpent)}
              </span>
            )}
          </div>
          <p className="text-base font-medium">
            {question.mcq.isMath
              ? parseMathString(question.mcq.question)
              : question.mcq.question}
          </p>
        </div>
      </div>

      {/* Context (if exists) */}
      {question.mcq.context && (
        <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
          {question.mcq.isMath
            ? parseMathString(question.mcq.context)
            : question.mcq.context}
        </div>
      )}

      {/* Statements (if exists) */}
      {statementsRecord && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
          <p className="font-medium text-xs text-muted-foreground mb-2">
            Statements:
          </p>
          <div className="space-y-1">
            {Object.entries(statementsRecord).map(([key, value]) => (
              <p key={key} className="text-sm">
                <span className="font-medium">{key}:</span>{" "}
                {question.mcq.isMath ? parseMathString(value) : value}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2 mb-4">
        {Object.entries(optionsRecord).map(([key, value]) => {
          const isSelected = question.selectedOption === key;
          const isCorrectOption = question.correctAnswer === key;

          return (
            <div
              key={key}
              className={cn(
                "p-3 rounded-lg border-2 transition-colors",
                isCorrectOption && "border-success bg-success/5",
                isSelected &&
                  !isCorrectOption &&
                  "border-destructive bg-destructive/5",
                !isSelected && !isCorrectOption && "border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                    isCorrectOption
                      ? "bg-success text-success-foreground"
                      : isSelected
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {key}
                </span>
                <span className="flex-1 text-sm">
                  {question.mcq.isMath ? parseMathString(value) : value}
                </span>
                {isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                )}
                {isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        {isCorrect ? (
          <div className="flex items-center gap-1 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Correct Answer
          </div>
        ) : isSkipped ? (
          <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
            <MinusCircle className="w-4 h-4" />
            Skipped
          </div>
        ) : (
          <div className="flex items-center gap-1 text-destructive text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Wrong Answer
          </div>
        )}
      </div>

      {/* Explanation */}
      {question.mcq.explanation && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs font-semibold text-primary mb-1">Explanation</p>
          <p className="text-sm text-foreground">
            {question.mcq.isMath
              ? parseMathString(question.mcq.explanation)
              : question.mcq.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}
