import { cn } from "@workspace/ui/lib/utils";
import { Check, X } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { parseMathString } from "@/lib/katex";

interface Mcq {
  id: string;
  question: string;
  options: string[];
  answer: string; // ✅ Now expects option LETTER ("A", "B", "C", "D")
  explanation?: string | null;
  subject?: string;
  chapter?: string;
  type?: string;
  isMath?: boolean;
  context?: string | null;
  statements?: string[];
}

interface McqQuestionProps {
  mcq: Mcq;
  questionNumber: number;
  selectedOption: string | null; // ✅ Now expects option LETTER ("A", "B", "C", "D")
  onSelectOption: (optionLetter: string) => void; // ✅ Now passes option LETTER
  showResult?: boolean;
  disabled?: boolean;
}

export function McqQuestion({
  mcq,
  questionNumber,
  selectedOption,
  onSelectOption,
  showResult = false,
  disabled = false,
}: McqQuestionProps) {
  // ✅ FIXED: Now compares option LETTERS instead of option TEXT
  const getOptionState = (optionLetter: string) => {
    if (!showResult) {
      return selectedOption === optionLetter ? "selected" : "default";
    }
    // In result view, compare letters
    if (optionLetter === mcq.answer) return "correct";
    if (optionLetter === selectedOption && optionLetter !== mcq.answer) {
      return "incorrect";
    }
    return "default";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Question Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
            Question {questionNumber}
          </span>
          {mcq.type && (
            <Badge variant="default" className="text-xs">
              {mcq.type}
            </Badge>
          )}
        </div>

        {/* Context (if available) */}
        {mcq.context && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Context:
            </p>
            <p className="text-sm">
              {mcq.isMath ? parseMathString(mcq.context) : mcq.context}
            </p>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-lg font-medium text-foreground leading-relaxed">
          {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
        </h2>

        {/* Statements (for statement-based questions) */}
        {mcq.statements && mcq.statements.length > 0 && (
          <div className="space-y-2">
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
      </div>

      {/* Options */}
      <div className="space-y-3">
        {mcq.options.map((optionText, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
          const state = getOptionState(optionLetter); // ✅ Compare letters

          return (
            <button
              key={optionLetter}
              onClick={() => !disabled && onSelectOption(optionLetter)} // ✅ Pass letter, not text
              disabled={disabled}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                state === "default" &&
                  "border-border hover:border-primary/50 hover:bg-primary/5",
                state === "selected" && "border-primary bg-primary/10",
                state === "correct" && "border-success bg-success/10",
                state === "incorrect" && "border-destructive bg-destructive/10",
                disabled && "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-colors flex-shrink-0",
                  state === "default" && "bg-muted text-muted-foreground",
                  state === "selected" && "bg-primary text-primary-foreground",
                  state === "correct" && "bg-success text-success-foreground",
                  state === "incorrect" &&
                    "bg-destructive text-destructive-foreground"
                )}
              >
                {state === "correct" ? (
                  <Check className="w-4 h-4" />
                ) : state === "incorrect" ? (
                  <X className="w-4 h-4" />
                ) : (
                  optionLetter
                )}
              </div>
              <span
                className={cn(
                  "flex-1 font-medium",
                  state === "correct" && "text-success",
                  state === "incorrect" && "text-destructive"
                )}
              >
                {mcq.isMath ? parseMathString(optionText || "") : optionText}{" "}
                {/* ✅ Display the text, but compare letters */}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation (only in result view) */}
      {showResult && mcq.explanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Explanation
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {mcq.isMath
              ? parseMathString(mcq.explanation || "")
              : mcq.explanation}
          </p>
        </div>
      )}

      {/* Show correct answer if user got it wrong */}
      {showResult && selectedOption && selectedOption !== mcq.answer && (
        <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
          <p className="text-sm font-medium text-success">
            ✓ Correct Answer: <span className="font-bold">{mcq.answer}</span> -{" "}
            {mcq.isMath
              ? parseMathString(
                  mcq.options[mcq.answer.charCodeAt(0) - 65] || ""
                )
              : mcq.options[mcq.answer.charCodeAt(0) - 65]}
          </p>
        </div>
      )}
    </div>
  );
}
