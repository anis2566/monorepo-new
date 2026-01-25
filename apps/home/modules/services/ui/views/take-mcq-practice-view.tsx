"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";
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
import { ExamHeader } from "../components/exam-header";
import { QuestionCard } from "../components/question-card";
import { PerformanceStats } from "../components/perfomance-stats";
import { MobileQuickJump } from "../components/mobile-quick-jump";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePracticeExamAttempt } from "../../hooks/use-practice-exam-attempt";
import { useConfetti } from "@/hooks/use-confetti";
import { useAudioFeedback } from "@/hooks/use-audio-feedback";
import { normalizeOptionLabel, getCorrectLetter } from "@/lib/mcq";

interface TakeMcqPracticeProps {
    attemptId: string;
    demoExamId: string;
}

export default function TakeMcqPractice({ attemptId, demoExamId }: TakeMcqPracticeProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const { fireStreakConfetti, fireBestStreakConfetti } = useConfetti();
    const { playCorrectSound, playIncorrectSound } = useAudioFeedback();

    const { data } = useSuspenseQuery(
        trpc.home.demoExam.getPracticeQuestions.queryOptions({ demoExamId })
    );

    const questions = data.questions;
    const exam = data.exam;

    const {
        stats,
        status,
        submitAnswer,
        submitExam,
        onQuestionView,
        getAnswerState,
        isAnswered,
        getSelectedOption,
        isSubmitting,
        isAnswering,
    } = usePracticeExamAttempt(demoExamId, attemptId, questions);

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

    const handleSelectOption = async (questionIndex: number, option: string) => {
        const question = questions[questionIndex];
        if (!question || isAnswered(question.id)) return;

        const selectedEnglish = option;
        const correctEnglish = getCorrectLetter(question.answer, question.options);
        const isCorrect = normalizeOptionLabel(selectedEnglish) === normalizeOptionLabel(correctEnglish);

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
        submitExam();
    }, [submitExam]);

    const handleSubmit = () => {
        setShowSubmitDialog(false);
        submitExam();
    };

    const getQuickJumpState = (index: number) => {
        const question = questions[index];
        if (!question) return "unanswered";
        const correctLetter = getCorrectLetter(question.answer, question.options);
        return getAnswerState(question.id, correctLetter);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col lg:flex-row bg-background relative">
                <div className="flex-1 flex flex-col min-h-screen">
                    <ExamHeader
                        title={exam.title}
                        totalQuestions={questions.length}
                        answeredCount={stats.answered}
                        duration={exam.duration}
                        onTimeUp={handleTimeUp}
                        type="Practice"
                        isActive={status === "In Progress"}
                    />

                    <div className="flex-1 overflow-y-auto">
                        <div className="px-4 lg:px-8 py-6 lg:py-8">
                            <div className="max-w-3xl mx-auto lg:mr-0 lg:max-w-none lg:pr-80">
                                <div className="space-y-6">
                                    {questions.map((question: any, index: number) => {
                                        const selectedOption = getSelectedOption(question.id);
                                        const answerState = getAnswerState(
                                            question.id,
                                            getCorrectLetter(question.answer, question.options)
                                        );

                                        return (
                                            <QuestionCard
                                                key={question.id}
                                                mcq={question}
                                                questionNumber={index + 1}
                                                selectedOption={selectedOption}
                                                onSelectOption={(opt: string) =>
                                                    handleSelectOption(index, opt)
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
                                            : `Submit Practice (${stats.answered}/${questions.length} answered)`}
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
                            {questions.map((_: any, index: number) => {
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
                        <AlertDialogTitle>Submit Practice Session?</AlertDialogTitle>
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
                        <AlertDialogCancel>Continue Practice</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
