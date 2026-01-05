import { useState, useCallback, useRef } from "react";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface ExamAttemptState {
  answers: Map<string, string>;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  currentStreak: number;
  bestStreak: number;
  score: number;
  answeredCount: number;
  status: string;
  startTime: Date | null;
  lastAnsweredTime: Date | null;
}

interface ExamQuestion {
  id: string;
  answer: string;
  [key: string]: any;
}

export function useExamAttempt(
  examId: string,
  attemptId: string, // ✅ Accept attemptId directly
  questions: ExamQuestion[]
) {
  const router = useRouter();
  const trpc = useTRPC();
  const answerStartTimeRef = useRef<Date | null>(null);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<ExamAttemptState>({
    answers: new Map(),
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedQuestions: questions.length,
    currentStreak: 0,
    bestStreak: 0,
    score: 0,
    answeredCount: 0,
    status: "In Progress",
    startTime: new Date(), // Set immediately
    lastAnsweredTime: null,
  });

  // Set timer on mount
  if (!answerStartTimeRef.current) {
    answerStartTimeRef.current = new Date();
  }

  // Submit answer mutation
  const submitAnswerMutation = useMutation(
    trpc.student.exam.submitAnswer.mutationOptions({
      onError: (error) => {
        toast.error("Failed to submit answer");
        console.error(error);
      },
    })
  );

  // Submit exam mutation
  const submitExamMutation = useMutation(
    trpc.student.exam.submitExam.mutationOptions({
      onSuccess: (data, variables) => {
        const message =
          variables.submissionType === "Manual"
            ? "Exam submitted successfully!"
            : "Exam auto-submitted";

        toast.success(message);

        setTimeout(() => {
          router.push(`/results/${attemptId}`);
        }, 500);
      },
      onError: (error) => {
        toast.error("Failed to submit exam");
        console.error(error);
        isSubmittingRef.current = false;
      },
    })
  );

  // Tab switch mutation
  const tabSwitchMutation = useMutation(
    trpc.student.exam.recordTabSwitch.mutationOptions({
      onSuccess: () => {
        toast.error("Exam auto-submitted due to leaving the exam tab", {
          duration: 5000,
        });

        setState((prev) => ({
          ...prev,
          status: "Auto-Submitted",
        }));

        setTimeout(() => {
          router.push(`/results/${attemptId}`);
        }, 1000);
      },
      onError: (error) => {
        console.error("Failed to record tab switch:", error);
        isSubmittingRef.current = false;
      },
    })
  );

  // Submit an answer
  const submitAnswer = useCallback(
    async (
      questionIndex: number,
      mcqId: string,
      selectedOption: string,
      correctAnswer: string
    ) => {
      if (state.answers.has(mcqId)) {
        return;
      }

      const isCorrect = selectedOption === correctAnswer;

      const now = new Date();
      const timeSpent = answerStartTimeRef.current
        ? Math.floor(
            (now.getTime() - answerStartTimeRef.current.getTime()) / 1000
          )
        : 0;

      // Update local state immediately
      setState((prev) => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(mcqId, selectedOption);

        const newCorrect = isCorrect
          ? prev.correctAnswers + 1
          : prev.correctAnswers;
        const newWrong = !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers;
        const newAnsweredCount = prev.answeredCount + 1;
        const newSkipped = questions.length - newAnsweredCount;

        const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);

        const newScore = newCorrect;

        return {
          ...prev,
          answers: newAnswers,
          correctAnswers: newCorrect,
          wrongAnswers: newWrong,
          skippedQuestions: newSkipped,
          answeredCount: newAnsweredCount,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          score: newScore,
          lastAnsweredTime: now,
        };
      });

      // Submit to backend with attemptId
      submitAnswerMutation.mutate({
        attemptId, // ✅ Use the attemptId from params
        mcqId,
        questionNumber: questionIndex + 1,
        selectedOption,
        correctAnswer,
        timeSpent,
      });

      answerStartTimeRef.current = now;
    },
    [attemptId, state.answers, questions.length, submitAnswerMutation]
  );

  // Handle tab switch
  const handleTabSwitch = useCallback(async () => {
    if (isSubmittingRef.current) return;
    if (state.status !== "In Progress") return;

    isSubmittingRef.current = true;

    try {
      await tabSwitchMutation.mutateAsync({
        attemptId, // ✅ Use the attemptId from params
      });
    } catch (error) {
      console.error("Failed to handle tab switch:", error);
      isSubmittingRef.current = false;
    }
  }, [attemptId, state.status, tabSwitchMutation]);

  // Submit exam
  const submitExam = useCallback(
    async (submissionType: "Manual" | "Auto-TimeUp" = "Manual") => {
      if (isSubmittingRef.current) return;
      if (state.status !== "In Progress") {
        toast.error("Exam is not in progress");
        return;
      }

      isSubmittingRef.current = true;

      try {
        await submitExamMutation.mutateAsync({
          attemptId, // ✅ Use the attemptId from params
          submissionType,
        });

        setState((prev) => ({
          ...prev,
          status: submissionType === "Manual" ? "Submitted" : "Auto-Submitted",
        }));
      } catch (error) {
        isSubmittingRef.current = false;
      }
    },
    [attemptId, state.status, submitExamMutation]
  );

  // Track when user starts viewing a question
  const onQuestionView = useCallback((questionIndex: number) => {
    if (!answerStartTimeRef.current) {
      answerStartTimeRef.current = new Date();
    }
  }, []);

  // Get answer state for a question
  const getAnswerState = useCallback(
    (mcqId: string, correctAnswer: string) => {
      const selectedOption = state.answers.get(mcqId);

      if (!selectedOption) return "unanswered";
      return selectedOption === correctAnswer ? "correct" : "incorrect";
    },
    [state.answers]
  );

  // Check if a question is answered
  const isAnswered = useCallback(
    (mcqId: string) => {
      return state.answers.has(mcqId);
    },
    [state.answers]
  );

  // Get selected option for a question
  const getSelectedOption = useCallback(
    (mcqId: string) => {
      return state.answers.get(mcqId) || null;
    },
    [state.answers]
  );

  return {
    // State
    answers: state.answers,
    stats: {
      correct: state.correctAnswers,
      wrong: state.wrongAnswers,
      skipped: state.skippedQuestions,
      streak: state.currentStreak,
      bestStreak: state.bestStreak,
      score: state.score,
      answered: state.answeredCount,
      total: questions.length,
    },
    status: state.status,
    startTime: state.startTime,

    // Actions
    submitAnswer,
    submitExam,
    handleTabSwitch,
    onQuestionView,

    // Helpers
    getAnswerState,
    isAnswered,
    getSelectedOption,

    // Loading states
    isSubmitting: submitExamMutation.isPending || tabSwitchMutation.isPending,
    isAnswering: submitAnswerMutation.isPending,
  };
}
