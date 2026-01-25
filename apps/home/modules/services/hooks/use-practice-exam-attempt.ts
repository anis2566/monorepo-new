import { useState, useCallback, useRef, useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { normalizeOptionLabel } from "@/lib/mcq";

interface PracticeAttemptState {
    answers: Map<string, string>;
    correctAnswers: number;
    wrongAnswers: number;
    skippedQuestions: number;
    currentStreak: number;
    bestStreak: number;
    score: number;
    answeredCount: number;
    status: string;
}

interface ExamQuestion {
    id: string;
    answer: string;
    [key: string]: any;
}

export function usePracticeExamAttempt(
    demoExamId: string,
    attemptId: string,
    questions: ExamQuestion[]
) {
    const router = useRouter();
    const trpc = useTRPC();
    const answerStartTimeRef = useRef<Date | null>(null);
    const isSubmittingRef = useRef(false);

    // Initialize state from potential existing attempt data
    const { data: attemptData } = useQuery(
        trpc.home.demoExam.getAttemptStatus.queryOptions({
            attemptId,
        })
    );

    const [state, setState] = useState<PracticeAttemptState>({
        answers: new Map(),
        correctAnswers: 0,
        wrongAnswers: 0,
        skippedQuestions: questions.length,
        currentStreak: 0,
        bestStreak: 0,
        score: 0,
        answeredCount: 0,
        status: "In Progress",
    });

    // Update state when attempt data is loaded
    useEffect(() => {
        if (attemptData) {
            const dbAnswers = (attemptData.answers as any[]) || [];
            const answersMap = new Map();
            dbAnswers.forEach((ans) => {
                answersMap.set(ans.mcqId, ans.selectedOption);
            });

            setState({
                answers: answersMap,
                correctAnswers: attemptData.correctAnswers,
                wrongAnswers: attemptData.wrongAnswers,
                skippedQuestions: attemptData.skippedQuestions,
                currentStreak: 0, // Not explicitly tracked in DB yet, but could be inferred
                bestStreak: 0,
                score: attemptData.score,
                answeredCount: attemptData.answeredCount,
                status: attemptData.status,
            });
        }
    }, [attemptData]);

    if (!answerStartTimeRef.current) {
        answerStartTimeRef.current = new Date();
    }

    const submitAnswerMutation = useMutation(
        trpc.home.demoExam.submitAnswer.mutationOptions({
            onError: (error) => {
                toast.error("Failed to sync answer with server");
                console.error(error);
            },
        })
    );

    const submitPracticeMutation = useMutation(
        trpc.home.demoExam.submitPractice.mutationOptions({
            onSuccess: () => {
                toast.success("Practice session submitted!");
                const params = new URLSearchParams(window.location.search);
                params.set("view", "result");
                router.push(`${window.location.pathname}?${params.toString()}`);
            },
            onError: (error) => {
                toast.error("Failed to submit practice session");
                console.error(error);
                isSubmittingRef.current = false;
            },
        })
    );

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

            const isCorrect = normalizeOptionLabel(selectedOption) === normalizeOptionLabel(correctAnswer);

            const now = new Date();
            const timeSpent = answerStartTimeRef.current
                ? Math.floor(
                    (now.getTime() - answerStartTimeRef.current.getTime()) / 1000
                )
                : 0;

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

                // Simple score for now
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
                };
            });

            submitAnswerMutation.mutate({
                attemptId,
                mcqId,
                selectedOption,
                correctAnswer,
                timeSpent,
            });

            answerStartTimeRef.current = now;
        },
        [attemptId, state.answers, questions.length, submitAnswerMutation]
    );

    const submitExam = useCallback(async () => {
        if (isSubmittingRef.current) return;
        if (state.status !== "In Progress") {
            toast.error("Practice session is not in progress");
            return;
        }

        isSubmittingRef.current = true;

        try {
            await submitPracticeMutation.mutateAsync({
                attemptId,
            });

            setState((prev) => ({
                ...prev,
                status: "Submitted",
            }));
        } catch (error) {
            isSubmittingRef.current = false;
        }
    }, [attemptId, state.status, submitPracticeMutation]);

    const onQuestionView = useCallback((questionIndex: number) => {
        if (!answerStartTimeRef.current) {
            answerStartTimeRef.current = new Date();
        }
    }, []);

    const getAnswerState = useCallback(
        (mcqId: string, correctAnswer: string) => {
            const selectedOption = state.answers.get(mcqId);

            if (!selectedOption) return "unanswered";
            // Normalize comparison as per API logic
            return normalizeOptionLabel(selectedOption) === normalizeOptionLabel(correctAnswer) ? "correct" : "incorrect";
        },
        [state.answers]
    );

    const isAnswered = useCallback(
        (mcqId: string) => {
            return state.answers.has(mcqId);
        },
        [state.answers]
    );

    const getSelectedOption = useCallback(
        (mcqId: string) => {
            return state.answers.get(mcqId) || null;
        },
        [state.answers]
    );

    return {
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
        submitAnswer,
        submitExam,
        onQuestionView,
        getAnswerState,
        isAnswered,
        getSelectedOption,
        isSubmitting: submitPracticeMutation.isPending,
        isAnswering: submitAnswerMutation.isPending,
    };
}
