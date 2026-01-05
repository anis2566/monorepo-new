import { useEffect, useRef } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { parseMathString } from "@/lib/katex";

interface Mcq {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: string;
  subject?: {
    name: string;
  };
  chapter?: {
    name: string;
  };
  isMath?: boolean;
  explanation?: string | null;
  statements?: string[];
  context?: string | null;
}

interface QuestionCardProps {
  mcq: Mcq;
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  disabled?: boolean;
  answerState?: "unanswered" | "correct" | "incorrect";
  onView?: () => void;
}

export function QuestionCard({
  mcq,
  questionNumber,
  selectedOption,
  onSelectOption,
  disabled = false,
  answerState = "unanswered",
  onView,
}: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Call onView when component is first rendered or comes into view
  useEffect(() => {
    if (onView && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onView();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(cardRef.current);

      return () => {
        if (cardRef.current) {
          observer.unobserve(cardRef.current);
        }
      };
    }
  }, [onView]);

  const isAnswered = selectedOption !== null;

  return (
    <Card
      ref={cardRef}
      id={`question-${questionNumber}`}
      className={cn(
        "scroll-mt-24 transition-all duration-200",
        isAnswered &&
          answerState === "correct" &&
          "border-success/50 bg-success/5",
        isAnswered &&
          answerState === "incorrect" &&
          "border-destructive/50 bg-destructive/5"
      )}
    >
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm",
                !isAnswered && "bg-primary/10 text-primary",
                isAnswered &&
                  answerState === "correct" &&
                  "bg-success/20 text-success",
                isAnswered &&
                  answerState === "incorrect" &&
                  "bg-destructive/20 text-destructive"
              )}
            >
              {questionNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={mcq.type === "MCQ" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {mcq.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Answer Status Badge */}
          {isAnswered && (
            <div className="flex items-center gap-2">
              {answerState === "correct" ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-success">
                    Correct
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Wrong
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Context (if available) */}
        {mcq.context && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Context:
            </p>
            <p className="text-sm">
              {mcq.isMath ? parseMathString(mcq.context) : mcq.context}
            </p>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-base leading-relaxed font-medium">
            {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
          </p>
        </div>

        {/* Statements (for statement-based questions) */}
        {mcq.statements && mcq.statements.length > 0 && (
          <div className="mb-4 space-y-2">
            {mcq.statements.map((statement, index) => (
              <div
                key={index}
                className="p-3 bg-muted/30 rounded-md border border-border"
              >
                <p className="text-sm">
                  <span className="font-semibold">Statement {index + 1}: </span>
                  {mcq.isMath ? parseMathString(statement) : statement}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {mcq.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === optionLabel;
            const isCorrectAnswer = mcq.answer === optionLabel;

            return (
              <button
                key={index}
                onClick={() =>
                  !disabled && !isAnswered && onSelectOption(optionLabel)
                }
                disabled={disabled || isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                  "hover:shadow-md active:scale-[0.99]",
                  // Default state
                  !isAnswered &&
                    !isSelected &&
                    "border-border bg-card hover:border-primary/50",
                  // Selected but not answered yet
                  !isAnswered && isSelected && "border-primary bg-primary/5",
                  // Answered - show correct/incorrect
                  isAnswered &&
                    isSelected &&
                    answerState === "correct" &&
                    "border-success bg-success/10",
                  isAnswered &&
                    isSelected &&
                    answerState === "incorrect" &&
                    "border-destructive bg-destructive/10",
                  isAnswered && !isSelected && "border-border bg-muted/30",
                  // Show correct answer when wrong answer selected
                  isAnswered &&
                    answerState === "incorrect" &&
                    isCorrectAnswer &&
                    "border-success/50 bg-success/5",
                  // Disabled state
                  (disabled || isAnswered) && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Option Circle */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm flex-shrink-0",
                      !isAnswered &&
                        !isSelected &&
                        "border-border bg-background",
                      !isAnswered &&
                        isSelected &&
                        "border-primary bg-primary text-primary-foreground",
                      isAnswered &&
                        isSelected &&
                        answerState === "correct" &&
                        "border-success bg-success text-success-foreground",
                      isAnswered &&
                        isSelected &&
                        answerState === "incorrect" &&
                        "border-destructive bg-destructive text-destructive-foreground",
                      isAnswered &&
                        !isSelected &&
                        isCorrectAnswer &&
                        "border-success bg-success/20 text-success",
                      isAnswered &&
                        !isSelected &&
                        !isCorrectAnswer &&
                        "border-border bg-muted"
                    )}
                  >
                    {optionLabel}
                  </div>

                  {/* Option Text */}
                  <span
                    className={cn(
                      "text-sm flex-1",
                      isAnswered &&
                        isSelected &&
                        answerState === "correct" &&
                        "font-medium",
                      isAnswered &&
                        isSelected &&
                        answerState === "incorrect" &&
                        "font-medium"
                    )}
                  >
                    {mcq.isMath ? parseMathString(option) : option}
                  </span>

                  {/* Status Icon */}
                  {isAnswered && isSelected && (
                    <>
                      {answerState === "correct" ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      )}
                    </>
                  )}

                  {/* Show correct answer indicator */}
                  {isAnswered &&
                    answerState === "incorrect" &&
                    isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answering if available) */}
        {isAnswered && mcq.explanation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Explanation:
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {mcq.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
