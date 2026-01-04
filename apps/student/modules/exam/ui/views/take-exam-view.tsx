"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { UserAnswer } from "@/types/exam";
import { AlertTriangle, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mockExams, mockMcqs } from "@/data/mock";
import { useConfetti } from "@/hooks/use-confetti";
import { useAudioFeedback } from "@/hooks/use-audio-feedback";
import { useTabVisibility } from "@/hooks/use-tab-visibility";
import { ExamHeader } from "../components/exam-header";
import { QuestionCard } from "../components/question-card";
import { PerformanceStats } from "../components/perfomance-stats";
import { MobileQuickJump } from "../components/mobile-quick-jump";
import { ExamWarningModal } from "../modal/exam-warning-modal";

interface TakeExamProps {
  examId: string;
}

export default function TakeExam({ examId }: TakeExamProps) {
  const router = useRouter();
  const exam = mockExams.find((e) => e.id === examId);
  const questions = mockMcqs.slice(0, exam?.mcq || 5);
  const { fireStreakConfetti, fireBestStreakConfetti } = useConfetti();
  const { playCorrectSound, playIncorrectSound } = useAudioFeedback();

  const [answers, setAnswers] = useState<UserAnswer[]>(
    questions.map((q) => ({
      mcqId: q.id,
      selectedOption: null,
      isCorrect: undefined,
    }))
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(true);
  const [examStarted, setExamStarted] = useState(false);

  // Track previous stats for confetti triggers
  const prevStatsRef = useRef({ streak: 0, bestStreak: 0 });

  // Handle auto-submit on tab switch/close
  const handleAutoSubmit = useCallback(() => {
    if (!examStarted) return;
    toast.error("Exam auto-submitted due to leaving the exam tab", {
      duration: 5000,
    });
    // Use a small delay to show the toast before navigating
    setTimeout(() => {
      handleSubmitInternal();
    }, 100);
  }, [examStarted]);

  useTabVisibility({
    enabled: examStarted,
    onVisibilityChange: (isVisible) => {
      if (!isVisible) {
        handleAutoSubmit();
      }
    },
  });

  const handleStartExam = () => {
    setShowWarningModal(false);
    setExamStarted(true);
  };

  const handleCancelExam = () => {
    router.push("/exams");
  };

  // Calculate real-time stats
  const stats = useMemo(() => {
    let score = 0;
    let wrong = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    answers.forEach((answer, index) => {
      if (answer.selectedOption !== null) {
        const isCorrect = answer.selectedOption === questions[index]?.answer;
        if (isCorrect) {
          score++;
          tempStreak++;
          if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
          }
        } else {
          wrong++;
          tempStreak = 0;
        }
      }
    });

    // Calculate current streak from the end (most recent answers)
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i]?.selectedOption !== null) {
        const isCorrect = answers[i]?.selectedOption === questions[i]?.answer;
        if (isCorrect) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return { score, wrong, streak: currentStreak, bestStreak };
  }, [answers, questions]);

  // Trigger confetti on streak achievements
  useEffect(() => {
    const prev = prevStatsRef.current;

    // Check for new best streak (only when it increases)
    if (stats.bestStreak > prev.bestStreak && stats.bestStreak >= 3) {
      fireBestStreakConfetti();
    }
    // Check for 5-streak achievement
    else if (stats.streak === 5 && prev.streak < 5) {
      fireStreakConfetti();
    }

    prevStatsRef.current = {
      streak: stats.streak,
      bestStreak: stats.bestStreak,
    };
  }, [
    stats.streak,
    stats.bestStreak,
    fireStreakConfetti,
    fireBestStreakConfetti,
  ]);

  const answeredCount = answers.filter((a) => a.selectedOption !== null).length;

  const handleSelectOption = (questionIndex: number, option: string) => {
    // Check if already answered - don't allow changing
    if (answers[questionIndex]?.selectedOption !== null) return;

    const isCorrect = option === questions[questionIndex]?.answer;

    // Play audio feedback immediately
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    setAnswers((prev) =>
      prev.map((a, i) =>
        i === questionIndex
          ? {
              ...a,
              selectedOption: option,
              isCorrect,
            }
          : a
      )
    );
  };

  const handleTimeUp = useCallback(() => {
    setShowSubmitDialog(true);
  }, []);

  const handleSubmitInternal = useCallback(() => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    answers.forEach((answer, index) => {
      if (answer.selectedOption === null) {
        skipped++;
      } else if (answer.selectedOption === questions[index]?.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = exam?.hasNegativeMark
      ? correct - incorrect * (exam.negativeMark || 0)
      : correct;

    router.push("/results");
  }, [answers, questions, exam, router]);

  const handleSubmit = () => {
    handleSubmitInternal();
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    router.push("/exams");
  };

  // Get answer state for quick jump buttons
  const getAnswerState = (index: number) => {
    const answer = answers[index];
    if (answer?.selectedOption === null) return "unanswered";
    return answer?.selectedOption === questions[index]?.answer
      ? "correct"
      : "incorrect";
  };

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Exam not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <ExamHeader
            title={exam.title}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            duration={exam.duration}
            onTimeUp={handleTimeUp}
            onExit={handleExit}
          />

          {/* Scrollable Questions List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-8 py-6 lg:py-8">
              <div className="max-w-3xl mx-auto lg:mr-0 lg:max-w-none lg:pr-80">
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      mcq={question}
                      questionNumber={index + 1}
                      selectedOption={answers[index]?.selectedOption || null}
                      onSelectOption={(option) =>
                        handleSelectOption(index, option)
                      }
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 pb-8">
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    className="w-full py-6 text-base font-semibold"
                    size="lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Exam ({answeredCount}/{questions.length} answered)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar - Performance Stats */}
        <aside className="hidden lg:block fixed right-0 top-0 w-72 h-screen bg-background border-l border-border overflow-y-auto pt-24 pb-8 px-4">
          <PerformanceStats
            score={stats.score}
            streak={stats.streak}
            bestStreak={stats.bestStreak}
            wrong={stats.wrong}
            answered={answeredCount}
            total={questions.length}
          />

          {/* Quick Jump Navigation */}
          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Quick Jump
            </p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const state = getAnswerState(index);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      document
                        .getElementById(`question-${index + 1}`)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }}
                    className={cn(
                      "w-full aspect-square rounded-lg font-medium text-sm transition-all duration-200",
                      state === "unanswered" &&
                        "bg-muted text-muted-foreground hover:bg-muted/80",
                      state === "correct" &&
                        "bg-success/20 text-success border-2 border-success",
                      state === "incorrect" &&
                        "bg-destructive/20 text-destructive border-2 border-destructive"
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/20 border-2 border-success" />
                <span className="text-muted-foreground">
                  Correct ({stats.score})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive" />
                <span className="text-muted-foreground">
                  Wrong ({stats.wrong})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-muted-foreground">
                  Unanswered ({questions.length - answeredCount})
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Quick Jump FAB */}
        <MobileQuickJump
          totalQuestions={questions.length}
          getAnswerState={getAnswerState}
          stats={stats}
          answeredCount={answeredCount}
        />

        {/* Mobile Performance Stats (collapsible at bottom) */}
        <div className="lg:hidden border-t border-border bg-card p-4">
          <PerformanceStats
            score={stats.score}
            streak={stats.streak}
            bestStreak={stats.bestStreak}
            wrong={stats.wrong}
            answered={answeredCount}
            total={questions.length}
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  You have answered {answeredCount} out of {questions.length}{" "}
                  questions.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <p className="text-lg font-bold text-success">
                      {stats.score}
                    </p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </div>
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <p className="text-lg font-bold text-destructive">
                      {stats.wrong}
                    </p>
                    <p className="text-xs text-muted-foreground">Wrong</p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-lg font-bold text-muted-foreground">
                      {questions.length - answeredCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Skipped</p>
                  </div>
                </div>
                {questions.length - answeredCount > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-warning">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {questions.length - answeredCount} questions are still
                      unanswered.
                    </span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exam Warning Modal */}
      <ExamWarningModal
        open={showWarningModal}
        onConfirm={handleStartExam}
        onCancel={handleCancelExam}
      />
    </>
  );
}
