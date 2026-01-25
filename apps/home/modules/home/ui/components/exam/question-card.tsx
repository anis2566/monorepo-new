import { useEffect, useRef } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { CheckCircle2, NotebookPen, XCircle } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { parseMathString } from "@/lib/katex";

interface Mcq {
  id: string;
  question: string;
  options: string[];
  answer: string; // ✅ English (A, B, C, D)
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
  selectedOption: string | null; // ✅ English (A, B, C, D)
  onSelectOption: (option: string) => void; // ✅ Sends English (A, B, C, D)
  disabled?: boolean;
  answerState?: "unanswered" | "correct" | "incorrect";
  onView?: () => void;
}

// ✅ Bangla labels for DISPLAY ONLY
const BANGLA_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"];

export function QuestionCard({
  mcq,
  questionNumber,
  selectedOption, // English: A, B, C, D
  onSelectOption,
  disabled = false,
  answerState = "unanswered",
  onView,
}: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

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
      <CardContent className="p-4">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
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
          </div>

          {/* Answer Status Badge */}
          {isAnswered && (
            <div className="flex items-center gap-2">
              {answerState === "correct" ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-success">সঠিক</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    ভুল
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Context (if available) */}
        {mcq.context && (
          <div className="mb-2 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground font-medium mb-1">
              উদ্দীপক:
            </p>
            <p className="text-sm font-kalpurush">
              {mcq.isMath ? parseMathString(mcq.context) : mcq.context}
            </p>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-2 flex items-start gap-x-2">
          <NotebookPen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-base leading-relaxed font-bold font-kalpurush text-primary">
            {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
          </p>
        </div>

        {/* Statements (for statement-based questions) */}
        {mcq.statements && mcq.statements.length > 0 && (
          <div className="mb-4 space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
            {mcq.statements.map((statement, index) => {
              const romanNumerals = [
                "i",
                "ii",
                "iii",
                "iv",
                "v",
                "vi",
                "vii",
                "viii",
                "ix",
                "x",
              ];
              const statementLabel =
                romanNumerals[index] || (index + 1).toString();

              return (
                <div key={index} className="p-1.5 rounded-md">
                  <p className="text-sm font-kalpurush">
                    <span className="font-semibold">{statementLabel}. </span>
                    {mcq.isMath ? parseMathString(statement) : statement}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {mcq.statements && mcq?.statements?.length > 0 && (
          <p className="font-bold font-kalpurush mb-2">নিচের কোনটি সঠিক?</p>
        )}

        {/* Options */}
        <div className="space-y-1.5">
          {mcq.options.map((option, index) => {
            // ✅ Internal: English letter (A, B, C, D)
            const optionLetterEnglish = String.fromCharCode(65 + index);

            // ✅ Display: Bangla letter (ক, খ, গ, ঘ)
            const optionLetterBangla =
              BANGLA_LABELS[index] || optionLetterEnglish;

            // ✅ Compare using English
            const isSelected = selectedOption === optionLetterEnglish;
            const isCorrectAnswer = mcq.answer === optionLetterEnglish;

            return (
              <button
                key={index}
                onClick={() => {
                  if (!disabled && !isAnswered) {
                    // ✅ Send English to parent
                    onSelectOption(optionLetterEnglish); // Sends "A", "B", "C", "D"
                  }
                }}
                disabled={disabled || isAnswered}
                className={cn(
                  "w-full text-left p-2 rounded-lg border-2 transition-all duration-200",
                  "hover:shadow-md active:scale-[0.99]",
                  // Default state
                  !isAnswered &&
                    !isSelected &&
                    "border-border bg-card hover:border-primary/50",
                  // Selected but not answered yet
                  !isAnswered && isSelected && "border-primary bg-primary/5",
                  // Answered - show correct/incorrect for selected option only
                  isAnswered &&
                    isSelected &&
                    answerState === "correct" &&
                    "border-success bg-success/10",
                  isAnswered &&
                    isSelected &&
                    answerState === "incorrect" &&
                    "border-destructive bg-destructive/10",
                  // ✅ CHANGE: Don't highlight correct answer, just show as disabled
                  isAnswered &&
                    !isSelected &&
                    "border-border bg-muted/30 opacity-60",
                  // Disabled state
                  (disabled || isAnswered) && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Option Circle - Display Bangla */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm flex-shrink-0 font-kalpurush",
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
                      // ✅ CHANGE: Unselected options just look disabled
                      isAnswered &&
                        !isSelected &&
                        "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {optionLetterBangla} {/* ✅ Display Bangla: ক, খ, গ, ঘ */}
                  </div>

                  {/* Option Text */}
                  <span
                    className={cn(
                      "text-sm flex-1 font-kalpurush",
                      isAnswered && isSelected && "font-medium",
                      // ✅ CHANGE: Unselected options are muted
                      isAnswered && !isSelected && "text-muted-foreground"
                    )}
                  >
                    {mcq.isMath ? parseMathString(option) : option}
                  </span>

                  {/* Status Icon - Only on selected option */}
                  {isAnswered && isSelected && (
                    <>
                      {answerState === "correct" ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      )}
                    </>
                  )}

                  {/* ✅ REMOVED: No checkmark on correct answer when user was wrong */}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answering if available) */}
        {isAnswered && mcq.explanation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 font-kalpurush">
              ব্যাখ্যা:
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-kalpurush">
              {mcq.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
