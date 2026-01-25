"use client";

import { useMemo, useState } from "react";
import { useTRPC } from "@/trpc/react";
import {
    Loader2,
    XCircle,
    Trophy,
    Target,
    Clock,
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    MinusCircle,
    HelpCircle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { parseMathString } from "@/lib/katex";
import { normalizeOptionLabel, getCorrectLetter } from "@/lib/mcq";

interface PracticeResultViewProps {
    attemptId: string;
}

export default function PracticeResultView({ attemptId }: PracticeResultViewProps) {
    const router = useRouter();
    const trpc = useTRPC();

    const { data, isLoading, error } = useQuery(
        trpc.home.demoExam.getPracticeResult.queryOptions({ attemptId })
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground font-medium">
                        Calculating your practice result...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 max-w-md px-4">
                    <XCircle className="w-16 h-16 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold">Result Not Found</h2>
                    <p className="text-muted-foreground">
                        {(error as any)?.message ||
                            "We couldn't find the result you're looking for."}
                    </p>
                    <Button
                        onClick={() => router.push("/services/mcq-practice")}
                        className="w-full"
                    >
                        Back to Practice
                    </Button>
                </div>
            </div>
        );
    }

    const { attempt, exam, questions } = data;
    const percentage = (attempt.score / attempt.totalQuestions) * 100;

    return (
        <div className="min-h-screen bg-muted/30 py-8 px-4 lg:py-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Result Header Card */}
                <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
                    <CardContent className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                    <Trophy className="w-4 h-4" />
                                    Practice Session Completed
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black">
                                    Great effort!
                                </h1>
                                <p className="text-white/80 max-w-lg text-lg">
                                    You have completed the{" "}
                                    <span className="font-bold text-white">
                                        MCQ Practice Session
                                    </span>.
                                    Regular practice is the key to mastery. Check your detailed analysis below.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => router.push("/services/mcq-practice")}
                                    >
                                        New Practice
                                    </Button>
                                </div>
                            </div>

                            {/* Score Display */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all"></div>
                                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-white/20 flex items-center justify-center flex-col bg-white/10 backdrop-blur-md shadow-2xl">
                                    <span className="text-5xl md:text-7xl font-black">
                                        {attempt.score.toFixed(1)}
                                    </span>
                                    <span className="text-sm md:text-base font-bold opacity-80 uppercase tracking-widest mt-1">
                                        Out of {attempt.totalQuestions}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Review Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ListOrdered className="w-6 h-6 text-primary" />
                        Answer Review
                    </h2>
                    <ReviewSection questions={questions} />
                </div>
            </div>
        </div>
    );
}

function ListOrdered({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
    );
}

type FilterTab = "all" | "correct" | "wrong" | "skipped";

function ReviewSection({ questions }: { questions: any[] }) {
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    const filteredQuestions = useMemo(() => {
        switch (activeTab) {
            case "correct":
                return questions.filter((q) => q.isCorrect);
            case "wrong":
                return questions.filter((q) => q.isCorrect === false && q.selectedOption);
            case "skipped":
                return questions.filter((q) => !q.selectedOption);
            default:
                return questions;
        }
    }, [questions, activeTab]);

    const counts = {
        all: questions.length,
        correct: questions.filter(q => q.isCorrect).length,
        wrong: questions.filter(q => q.isCorrect === false && q.selectedOption).length,
        skipped: questions.filter(q => !q.selectedOption).length,
    };

    return (
        <div className="space-y-6">
            <Card className="p-1 inline-flex bg-muted/50 border-none shadow-sm">
                <div className="flex items-center gap-1">
                    <TabButton
                        active={activeTab === "all"}
                        onClick={() => setActiveTab("all")}
                        icon={<Target className="w-4 h-4" />}
                        label="All"
                        count={counts.all}
                    />
                    <TabButton
                        active={activeTab === "correct"}
                        onClick={() => setActiveTab("correct")}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        label="Correct"
                        count={counts.correct}
                        variant="success"
                    />
                    <TabButton
                        active={activeTab === "wrong"}
                        onClick={() => setActiveTab("wrong")}
                        icon={<XCircle className="w-4 h-4" />}
                        label="Wrong"
                        count={counts.wrong}
                        variant="destructive"
                    />
                    <TabButton
                        active={activeTab === "skipped"}
                        onClick={() => setActiveTab("skipped")}
                        icon={<MinusCircle className="w-4 h-4" />}
                        label="Skipped"
                        count={counts.skipped}
                        variant="muted"
                    />
                </div>
            </Card>

            <div className="space-y-4">
                {filteredQuestions.map((q, idx) => (
                    <PracticeQuestionReviewCard key={q.mcq.id} question={q} />
                ))}
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
    count,
    variant = "default",
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    count: number;
    variant?: "default" | "success" | "destructive" | "muted";
}) {
    const variantStyles = {
        default: active
            ? "bg-primary text-primary-foreground shadow-md"
            : "hover:bg-background/50 text-muted-foreground",
        success: active
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
            : "hover:bg-emerald-500/10 text-muted-foreground",
        destructive: active
            ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
            : "hover:bg-rose-500/10 text-muted-foreground",
        muted: active
            ? "bg-muted-foreground text-white shadow-md"
            : "hover:bg-muted-foreground/10 text-muted-foreground",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-semibold",
                variantStyles[variant]
            )}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
            <span
                className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    active ? "bg-white/20" : "bg-muted text-muted-foreground"
                )}
            >
                {count}
            </span>
        </button>
    );
}

function PracticeQuestionReviewCard({ question }: { question: any }) {
    const mcq = question.mcq;
    const isCorrect = question.isCorrect;
    const isSkipped = !question.selectedOption;

    const options = Array.isArray(mcq.options)
        ? mcq.options.reduce((acc: any, opt: string, i: number) => {
            acc[String.fromCharCode(65 + i)] = opt;
            return acc;
        }, {})
        : mcq.options;

    return (
        <Card className="py-6 px-2 border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0",
                    isCorrect ? "bg-emerald-100 text-emerald-600" :
                        isSkipped ? "bg-muted text-muted-foreground" :
                            "bg-rose-100 text-rose-600"
                )}>
                    {question.questionNumber}
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold text-xs border-primary/20 bg-primary/5 text-primary">
                            {mcq.subject.name}
                        </Badge>
                        <Badge variant="outline" className="font-medium text-xs">
                            {mcq.type}
                        </Badge>
                        {question.timeSpent && (
                            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                <Clock className="w-3 h-3" />
                                {question.timeSpent}s
                            </div>
                        )}
                    </div>

                    <div className="text-lg font-semibold leading-relaxed">
                        {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
                    </div>

                    {mcq.context && (
                        <div className="p-3 bg-muted/50 rounded-lg text-sm italic text-muted-foreground border-l-4 border-muted">
                            {mcq.isMath ? parseMathString(mcq.context) : mcq.context}
                        </div>
                    )}

                    <div className="grid gap-3">
                        {Object.entries(options).map(([key, value]: [string, any]) => {
                            const correctLetter = getCorrectLetter(mcq.answer, mcq.options);
                            const isSelected = normalizeOptionLabel(question.selectedOption) === normalizeOptionLabel(key);
                            const isCorrectOption = normalizeOptionLabel(correctLetter) === normalizeOptionLabel(key);

                            return (
                                <div
                                    key={key}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all flex items-start gap-3",
                                        isCorrectOption ? "border-emerald-500 bg-emerald-50/50" :
                                            isSelected && !isCorrectOption ? "border-rose-500 bg-rose-50/50" :
                                                "border-border bg-background"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm",
                                        isCorrectOption ? "bg-emerald-500 text-white" :
                                            isSelected ? "bg-rose-500 text-white" :
                                                "bg-muted text-muted-foreground"
                                    )}>
                                        {key}
                                    </div>
                                    <div className="flex-1 text-sm md:text-base font-medium pt-1">
                                        {mcq.isMath ? parseMathString(value) : value}
                                    </div>
                                    {isCorrectOption && (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    )}
                                    {isSelected && !isCorrectOption && (
                                        <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {mcq.explanation && (
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                Explanation
                            </div>
                            <div className="text-sm md:text-base text-indigo-900 leading-relaxed">
                                {mcq.isMath ? parseMathString(mcq.explanation) : mcq.explanation}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
