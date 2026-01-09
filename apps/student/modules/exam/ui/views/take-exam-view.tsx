"use client";

import { useState, useCallback, useMemo } from "react";
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
  studentId: string;
}

// Inline shuffle function
function shuffleArray<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  let currentSeed = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);

  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export default function TakeExam({
  examId,
  attemptId,
  studentId,
}: TakeExamProps) {
  const router = useRouter();
  const { fireStreakConfetti, fireBestStreakConfetti } = useConfetti();
  const { playCorrectSound, playIncorrectSound } = useAudioFeedback();
  const trpc = useTRPC();

  // Fetch exam data
  const { data } = useSuspenseQuery(
    trpc.student.exam.getForExam.queryOptions({ id: examId })
  );

  const exam = data.exam;
  const rawQuestions = data.questions;

  // ✅ CLEAN: Shuffle options, everything in ENGLISH (A, B, C, D)
  const questions = useMemo(() => {
    return rawQuestions.map((question) => {
      if (!exam.hasSuffle) {
        return {
          ...question,
          displayOptions: question.options,
          correctAnswerLetter: question.answer, // English: A, B, C, D
        };
      }

      const seed = `${studentId}-${question.id}`;
      const shuffledOptions = shuffleArray(question.options, seed);

      let correctAnswerEnglish: string;

      if (question.answer.length === 1 && /^[A-D]$/i.test(question.answer)) {
        const answerIndex = question.answer.toUpperCase().charCodeAt(0) - 65;
        const correctText = question.options[answerIndex];
        const newIndex = shuffledOptions.findIndex(
          (opt) => opt === correctText
        );
        correctAnswerEnglish = String.fromCharCode(65 + newIndex);
      } else {
        const newIndex = shuffledOptions.findIndex(
          (opt) => opt.trim() === question.answer.trim()
        );
        correctAnswerEnglish = String.fromCharCode(
          65 + (newIndex >= 0 ? newIndex : 0)
        );
      }

      return {
        ...question,
        displayOptions: shuffledOptions,
        correctAnswerLetter: correctAnswerEnglish, // English: A, B, C, D
      };
    });
  }, [rawQuestions, exam.hasSuffle, studentId]);

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

  // ✅ CLEAN: QuestionCard sends English, we just pass it through
  const handleSelectOption = async (questionIndex: number, option: string) => {
    const question = questions[questionIndex];

    if (!question) {
      return;
    }

    if (isAnswered(question.id)) {
      return;
    }

    // ✅ option is already English (A, B, C, D) from QuestionCard
    const selectedEnglish = option;
    const correctEnglish = question.correctAnswerLetter;

    const isCorrect = selectedEnglish === correctEnglish;

    // Play audio feedback
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // ✅ Submit with English labels
    await submitAnswer(
      questionIndex,
      question.id,
      selectedEnglish, // "A", "B", "C", "D"
      correctEnglish // "A", "B", "C", "D"
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

  const confirmExit = () => {
    router.push("/exams");
  };

  // ✅ CLEAN: Everything uses English
  const getQuickJumpState = (index: number) => {
    const question = questions[index];
    if (!question) return "unanswered";
    return getAnswerState(question.id, question.correctAnswerLetter); // English
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
            type={exam.type}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-8 py-6 lg:py-8">
              <div className="max-w-3xl mx-auto lg:mr-0 lg:max-w-none lg:pr-80">
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const selectedOption = getSelectedOption(question.id); // English
                    const answerState = getAnswerState(
                      question.id,
                      question.correctAnswerLetter // English
                    );

                    return (
                      <QuestionCard
                        key={question.id}
                        mcq={{
                          ...question,
                          options: question.displayOptions,
                          answer: question.correctAnswerLetter, // ✅ Pass English
                        }}
                        questionNumber={index + 1}
                        selectedOption={selectedOption} // ✅ English
                        onSelectOption={
                          (option) => handleSelectOption(index, option) // ✅ Receives English
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
