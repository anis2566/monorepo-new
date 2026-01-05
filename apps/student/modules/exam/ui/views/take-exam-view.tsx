"use client";

import { useState, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";
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
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { useAudioFeedback } from "@/hooks/use-audio-feedback";
import { useTabVisibility } from "@/hooks/use-tab-visibility";
import { ExamHeader } from "../components/exam-header";
import { QuestionCard } from "../components/question-card";
import { PerformanceStats } from "../components/perfomance-stats";
import { MobileQuickJump } from "../components/mobile-quick-jump";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExamAttempt } from "../../hooks/use-exam-attempt";
import { toast } from "sonner";

interface TakeExamProps {
  examId: string;
  attemptId: string;
}

export default function TakeExam({ examId, attemptId }: TakeExamProps) {
  const router = useRouter();
  const { fireStreakConfetti, fireBestStreakConfetti } = useConfetti();
  const { playCorrectSound, playIncorrectSound } = useAudioFeedback();
  const trpc = useTRPC();

  // Fetch exam data
  const { data } = useSuspenseQuery(
    trpc.student.exam.getForExam.queryOptions({ id: examId })
  );

  const exam = data.exam;
  const questions = data.questions;

  const {
    stats,
    status,
    submitAnswer,
    submitExam,
    handleTabSwitch,
    onQuestionView,
    getAnswerState,
    isAnswered,
    isSubmitting,
    isAnswering,
    getSelectedOption,
  } = useExamAttempt(examId, attemptId, questions);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [prevStats, setPrevStats] = useState({ streak: 0, bestStreak: 0 });

  const triggerConfettiEffects = useCallback(() => {
    if (stats.bestStreak > prevStats.bestStreak && stats.bestStreak >= 3) {
      fireBestStreakConfetti();
    } else if (stats.streak === 5 && prevStats.streak < 5) {
      fireStreakConfetti();
    }

    setPrevStats({
      streak: stats.streak,
      bestStreak: stats.bestStreak,
    });
  }, [
    stats.streak,
    stats.bestStreak,
    prevStats,
    fireStreakConfetti,
    fireBestStreakConfetti,
  ]);

  useTabVisibility({
    enabled: status === "In Progress",
    onVisibilityChange: (isVisible) => {
      if (!isVisible) {
        handleTabSwitch();
      }
    },
  });

  const handleSelectOption = async (questionIndex: number, option: string) => {
    const question = questions[questionIndex];

    if (!question) {
      return;
    }

    if (isAnswered(question.id)) {
      return;
    }

    // ✅ FIXED: Convert answer to correct format
    // Check if question.answer is a letter or actual text
    let correctOptionLetter: string;

    if (question.answer.length === 1 && /^[A-D]$/i.test(question.answer)) {
      // answer is already a letter like "A", "B", "C", "D"
      correctOptionLetter = question.answer.toUpperCase();
    } else {
      // answer is the actual option text, need to find which letter it is
      const correctOptionIndex = question.options.findIndex(
        (opt: string) => opt === question.answer
      );

      if (correctOptionIndex === -1) {
        console.error("❌ Could not find correct answer in options!", {
          answer: question.answer,
          options: question.options,
        });
        toast.error("Error: Could not verify answer");
        return;
      }

      // Convert index to letter: 0="A", 1="B", 2="C", 3="D"
      correctOptionLetter = String.fromCharCode(65 + correctOptionIndex);
    }

    console.log("✅ Answer Comparison:", {
      selectedOption: option,
      correctOptionLetter: correctOptionLetter,
      questionAnswer: question.answer,
      isCorrect: option === correctOptionLetter,
    });

    const isCorrect = option === correctOptionLetter;

    // Play audio feedback immediately
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // Submit the answer with BOTH as letters
    await submitAnswer(
      questionIndex,
      question.id,
      option, // Selected: "A", "B", "C", "D"
      correctOptionLetter // Correct: "A", "B", "C", "D"
    );

    triggerConfettiEffects();
  };

  const handleTimeUp = useCallback(() => {
    submitExam("Auto-TimeUp");
  }, [submitExam]);

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    submitExam("Manual");
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    router.push("/exams");
  };

  // Get answer state for quick jump buttons
  const getQuickJumpState = (index: number) => {
    const question = questions[index];

    if (!question) {
      return "unanswered";
    }

    // Convert answer to letter for comparison
    let correctOptionLetter: string;
    if (question.answer.length === 1 && /^[A-D]$/i.test(question.answer)) {
      correctOptionLetter = question.answer.toUpperCase();
    } else {
      const correctOptionIndex = question.options.findIndex(
        (opt: string) => opt === question.answer
      );
      correctOptionLetter =
        correctOptionIndex !== -1
          ? String.fromCharCode(65 + correctOptionIndex)
          : "A"; // fallback
    }

    return getAnswerState(question.id, correctOptionLetter);
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
            answeredCount={stats.answered}
            duration={exam.duration}
            onTimeUp={handleTimeUp}
            onExit={handleExit}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-8 py-6 lg:py-8">
              <div className="max-w-3xl mx-auto lg:mr-0 lg:max-w-none lg:pr-80">
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const selectedOption = getSelectedOption(question.id);

                    // Convert answer for display
                    let correctOptionLetter: string;
                    if (
                      question.answer.length === 1 &&
                      /^[A-D]$/i.test(question.answer)
                    ) {
                      correctOptionLetter = question.answer.toUpperCase();
                    } else {
                      const correctOptionIndex = question.options.findIndex(
                        (opt: string) => opt === question.answer
                      );
                      correctOptionLetter =
                        correctOptionIndex !== -1
                          ? String.fromCharCode(65 + correctOptionIndex)
                          : "A";
                    }

                    const answerState = getAnswerState(
                      question.id,
                      correctOptionLetter
                    );

                    return (
                      <QuestionCard
                        key={question.id}
                        mcq={question}
                        questionNumber={index + 1}
                        selectedOption={selectedOption}
                        onSelectOption={(option) =>
                          handleSelectOption(index, option)
                        }
                        disabled={isAnswered(question.id) || isAnswering}
                        answerState={answerState}
                        onView={() => onQuestionView(index)}
                      />
                    );
                  })}
                </div>

                <div className="mt-8 pb-8">
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    className="w-full py-6 text-base font-semibold"
                    size="lg"
                    disabled={isSubmitting || status !== "In Progress"}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting
                      ? "Submitting..."
                      : `Submit Exam (${stats.answered}/${questions.length} answered)`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed right-0 top-0 w-72 h-screen bg-background border-l border-border overflow-y-auto pt-24 pb-8 px-4">
          <PerformanceStats
            score={stats.score}
            streak={stats.streak}
            bestStreak={stats.bestStreak}
            wrong={stats.wrong}
            answered={stats.answered}
            total={stats.total}
          />

          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Quick Jump
            </p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const state = getQuickJumpState(index);
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

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/20 border-2 border-success" />
                <span className="text-muted-foreground">
                  Correct ({stats.correct})
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
                  Unanswered ({stats.skipped})
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Quick Jump FAB */}
        <MobileQuickJump
          totalQuestions={questions.length}
          getAnswerState={getQuickJumpState}
          stats={stats}
          answeredCount={stats.answered}
        />

        {/* Mobile Performance Stats */}
        <div className="lg:hidden border-t border-border bg-card p-4">
          <PerformanceStats
            score={stats.score}
            streak={stats.streak}
            bestStreak={stats.bestStreak}
            wrong={stats.wrong}
            answered={stats.answered}
            total={stats.total}
          />
        </div>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  You have answered {stats.answered} out of {questions.length}{" "}
                  questions.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <p className="text-lg font-bold text-success">
                      {stats.correct}
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
                      {stats.skipped}
                    </p>
                    <p className="text-xs text-muted-foreground">Skipped</p>
                  </div>
                </div>
                {stats.skipped > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-warning">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {stats.skipped} questions are still unanswered.
                    </span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Dialog */}
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
    </>
  );
}
