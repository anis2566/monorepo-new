"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  AlertTriangle,
  Send,
  ShieldCheck,
  RefreshCw,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { usePublicExamAttempt } from "../../hooks/use-public-exam-attempt";

interface TakePublicExamProps {
  examId: string;
  attemptId: string;
  participantId: string;
}

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

export default function TakePublicExam({
  examId,
  attemptId,
  participantId,
}: TakePublicExamProps) {
  const router = useRouter();
  const { fireStreakConfetti, fireBestStreakConfetti } = useConfetti();
  const { playCorrectSound, playIncorrectSound } = useAudioFeedback();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.public.exam.getPublicExam.queryOptions({ id: examId })
  );

  const { data: attemptData, refetch: refetchAttempt } = useSuspenseQuery(
    trpc.public.exam.getPublicAttempt.queryOptions({ attemptId })
  );

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendOtpMutation = useMutation(
    trpc.public.exam.sendPublicOtp.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("sendPublicOtp not available");
      },
    }
  );

  const verifyOtpMutation = useMutation(
    trpc.public.exam.verifyPublicPhone.mutationOptions() || {
      mutationFn: async () => {
        throw new Error("verifyPublicPhone not available");
      },
    }
  );

  const handleSendOtp = useCallback(async () => {
    if (!attemptData?.participant?.phone) return;
    try {
      await sendOtpMutation.mutateAsync({
        phone: attemptData.participant.phone,
      });
      setTimeLeft(60);
      toast.success("Verification code sent to your phone");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send OTP"
      );
    }
  }, [attemptData, sendOtpMutation]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6 || !attemptData?.participant?.phone) return;
    setIsVerifying(true);
    try {
      await verifyOtpMutation.mutateAsync({
        phone: attemptData.participant.phone,
        code: otp,
      });
      await refetchAttempt();
      toast.success("Phone verified successfully!");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Invalid verification code"
      );
    } finally {
      setIsVerifying(false);
    }
  }, [otp, attemptData, verifyOtpMutation, refetchAttempt]);

  useEffect(() => {
    if (
      attemptData?.participant &&
      !attemptData.participant.isVerified &&
      timeLeft === 0 &&
      !sendOtpMutation.isPending
    ) {
      handleSendOtp();
    }
  }, [
    attemptData?.participant,
    timeLeft,
    sendOtpMutation.isPending,
    handleSendOtp,
  ]);

  const isVerified = attemptData?.participant?.isVerified ?? false;
  const exam = data.exam;
  const rawQuestions = data.questions;

  const questions = useMemo(() => {
    return rawQuestions.map((question) => {
      const seed = `${participantId}-${question.id}`;

      // Use hasShuffle from exam data (note: typo in schema)
      const shuffledOptions = exam.hasShuffle
        ? shuffleArray(question.options, seed)
        : question.options;

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
        correctAnswerLetter: correctAnswerEnglish,
      };
    });
  }, [rawQuestions, exam.hasShuffle, participantId]);

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
  } = usePublicExamAttempt(examId, attemptId, questions);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [prevStats, setPrevStats] = useState({ streak: 0, bestStreak: 0 });

  const triggerConfettiEffects = useCallback(() => {
    if (stats.bestStreak > prevStats.bestStreak && stats.bestStreak >= 3) {
      fireBestStreakConfetti();
    } else if (stats.streak === 5 && prevStats.streak < 5) {
      fireStreakConfetti();
    }
    setPrevStats({ streak: stats.streak, bestStreak: stats.bestStreak });
  }, [
    stats.streak,
    stats.bestStreak,
    prevStats,
    fireStreakConfetti,
    fireBestStreakConfetti,
  ]);

  useTabVisibility({
    enabled: status === "In Progress" && isVerified,
    onVisibilityChange: (isVisible) => {
      if (!isVisible) handleTabSwitch();
    },
  });

  const handleSelectOption = async (questionIndex: number, option: string) => {
    const question = questions[questionIndex];
    if (!question || isAnswered(question.id)) return;

    const selectedEnglish = option;
    const correctEnglish = question.correctAnswerLetter;
    const isCorrect = selectedEnglish === correctEnglish;

    if (isCorrect) playCorrectSound();
    else playIncorrectSound();

    await submitAnswer(
      questionIndex,
      question.id,
      selectedEnglish,
      correctEnglish
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

  const getQuickJumpState = (index: number) => {
    const question = questions[index];
    if (!question) return "unanswered";
    return getAnswerState(question.id, question.correctAnswerLetter);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background relative">
        {!isVerified && (
          <div className="absolute inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border shadow-2xl rounded-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Verification Required</h2>
                <p className="text-muted-foreground">
                  Please verify your phone number to start the exam questions.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium bg-muted px-3 py-1.5 rounded-full mt-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>
                    +88{" "}
                    {attemptData?.participant?.phone?.replace(
                      /(\d{3})(\d{4})(\d{4})/,
                      "$1 **** $3"
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(v) => setOtp(v)}
                    disabled={isVerifying}
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <InputOTPSlot
                          key={idx}
                          index={idx}
                          className="w-12 h-14 text-xl font-bold bg-muted/50 border-muted-foreground/20 rounded-xl"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Start Exam"}
                  </Button>

                  <div className="text-center">
                    {timeLeft > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend code in{" "}
                        <span className="font-bold text-foreground">
                          {timeLeft}s
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        disabled={sendOtpMutation.isPending}
                        className="text-sm text-primary font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw
                          className={cn(
                            "w-3 h-3",
                            sendOtpMutation.isPending && "animate-spin"
                          )}
                        />
                        Resend Verification Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-screen">
          <ExamHeader
            title={exam.title}
            totalQuestions={questions.length}
            answeredCount={stats.answered}
            duration={exam.duration}
            onTimeUp={handleTimeUp}
            type={exam.type}
            isActive={isVerified}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-8 py-6 lg:py-8">
              <div className="max-w-3xl mx-auto lg:mr-0 lg:max-w-none lg:pr-80">
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const selectedOption = getSelectedOption(question.id);
                    const answerState = getAnswerState(
                      question.id,
                      question.correctAnswerLetter
                    );

                    return (
                      <QuestionCard
                        key={question.id}
                        mcq={{
                          ...question,
                          options: question.displayOptions,
                          answer: question.correctAnswerLetter,
                        }}
                        questionNumber={index + 1}
                        selectedOption={selectedOption}
                        onSelectOption={(opt) => handleSelectOption(index, opt)}
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
          </div>
        </aside>

        <MobileQuickJump
          totalQuestions={questions.length}
          getAnswerState={getQuickJumpState}
          stats={stats}
          answeredCount={stats.answered}
        />
      </div>

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
    </>
  );
}
