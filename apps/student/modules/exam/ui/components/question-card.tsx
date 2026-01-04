import { Card } from "@workspace/ui/components/card";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Flag } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Mcq } from "@/types/exam";
import { cn } from "@workspace/ui/lib/utils";

interface QuestionCardProps {
  mcq: Mcq;
  questionNumber: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  showResult?: boolean;
  isLocked?: boolean;
}

export function QuestionCard({
  mcq,
  questionNumber,
  selectedOption,
  onSelectOption,
  showResult = false,
  isLocked = false,
}: QuestionCardProps) {
  // Question is locked if an option has been selected (instant lock) or if showResult is true
  const locked = isLocked || selectedOption !== null;

  const getOptionState = (option: string) => {
    // During exam: only show selected state, no correct/incorrect feedback
    if (!showResult) {
      if (option === selectedOption) return "selected";
      if (selectedOption !== null) return "disabled"; // Disable other options once one is selected
      return "default";
    }
    // In results view: show correct/incorrect states
    if (option === mcq.answer) return "correct";
    if (option === selectedOption && option !== mcq.answer) return "incorrect";
    return "disabled";
  };

  return (
    <Card className="overflow-hidden" id={`question-${questionNumber}`}>
      {/* Question Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <Tabs defaultValue="question" className="w-auto">
          <TabsList className="h-8 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="question"
              className="h-8 px-0 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
            >
              Question {questionNumber}
            </TabsTrigger>
            {mcq.explanation && (
              <TabsTrigger
                value="contextual"
                className="h-8 px-0 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
              >
                Contextual
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
          <Flag className="w-4 h-4 mr-1" />
          Flag
        </Button>
      </div>

      {/* Question Content */}
      <div className="p-4 lg:p-6">
        <p className="text-base lg:text-lg font-medium text-foreground leading-relaxed mb-6">
          {mcq.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {mcq.options.map((option, idx) => {
            const state = getOptionState(option);
            const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi"];
            const optionLabel = romanNumerals[idx] || String(idx + 1);
            const isDisabled = locked || showResult;

            return (
              <button
                key={idx}
                onClick={() => !isDisabled && onSelectOption(option)}
                disabled={isDisabled}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  state === "default" &&
                    "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                  state === "selected" && "border-primary bg-primary/10",
                  state === "correct" && "border-success bg-success/10",
                  state === "incorrect" &&
                    "border-destructive bg-destructive/10",
                  state === "disabled" &&
                    "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 border-2",
                    state === "default" &&
                      "border-border text-muted-foreground",
                    state === "selected" &&
                      "border-primary bg-primary text-primary-foreground",
                    state === "correct" &&
                      "border-success bg-success text-success-foreground",
                    state === "incorrect" &&
                      "border-destructive bg-destructive text-destructive-foreground",
                    state === "disabled" &&
                      "border-border text-muted-foreground"
                  )}
                >
                  {optionLabel}
                </span>
                <span
                  className={cn(
                    "text-sm lg:text-base flex-1",
                    state === "selected" && "font-medium text-primary",
                    state === "correct" && "font-medium text-success",
                    state === "incorrect" && "font-medium text-destructive",
                    (state === "default" || state === "disabled") &&
                      "text-foreground"
                  )}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown only in results view) */}
        {showResult && mcq.explanation && (
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm font-medium text-foreground mb-2">
              Explanation:
            </p>
            <p className="text-sm text-muted-foreground">{mcq.explanation}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
