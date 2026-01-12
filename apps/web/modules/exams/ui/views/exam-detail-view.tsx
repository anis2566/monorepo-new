"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Trash2,
  Copy,
  Download,
  Pause,
  Play,
  FileText,
  ListChecks,
  Users,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { toast } from "sonner";
import Link from "next/link";
import { ExamHeaderCard } from "../components/exam-header-card";
import { ExamStatsGrid } from "../components/exam-stats-grid";
import { ExamOverviw } from "../components/exam-overview";
import { ExamAttemptsTable } from "../components/exam-attempts-table";
import { ExamAnalyticsCharts } from "../components/exam-analytics-charts";
import { ExamMcqsCardView } from "../components/exam-mcqs";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface ExamDetailViewProps {
  examId: string;
}

export const ExamDetailView = ({ examId }: ExamDetailViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const [attemptsPage, setAttemptsPage] = useState(1);
  const { openDeleteModal } = useDeleteModal();
  const queryClient = useQueryClient();

  const { data: exam } = useSuspenseQuery(
    trpc.admin.exam.getExamDetails.queryOptions({ examId })
  );

  const { data: stats } = useSuspenseQuery(
    trpc.admin.exam.getExamStats.queryOptions({ examId })
  );

  const { data: attemptsData } = useSuspenseQuery(
    trpc.admin.exam.getExamAttempts.queryOptions({
      examId,
      page: attemptsPage,
      limit: 10,
    })
  );

  const { data: mcqs } = useSuspenseQuery(
    trpc.admin.exam.getExamMcqs.queryOptions({ examId })
  );

  const { data: scoreDistribution } = useSuspenseQuery(
    trpc.admin.exam.getScoreDistribution.queryOptions({ examId })
  );

  const { data: answerDistribution } = useSuspenseQuery(
    trpc.admin.exam.getAnswerDistribution.queryOptions({ examId })
  );

  const { data: timeAnalysis } = useSuspenseQuery(
    trpc.admin.exam.getTimeAnalysis.queryOptions({ examId })
  );

  const { data: antiCheat } = useSuspenseQuery(
    trpc.admin.exam.getAntiCheatSummary.queryOptions({ examId })
  );

  const { mutate: deleteExam } = useMutation(
    trpc.admin.exam.deleteOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.exam.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteExam = (examId: string, examName: string) => {
    openDeleteModal({
      entityId: examId,
      entityType: "exam",
      entityName: examName,
      onConfirm: (id) => {
        deleteExam({ id });
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/exams")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Exam Details
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage examination
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/exams/edit/${exam.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Exam
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {exam.status === "Active" && (
                <DropdownMenuItem className="text-warning">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Exam
                </DropdownMenuItem>
              )}
              {exam.status === "Pending" && (
                <DropdownMenuItem className="text-success">
                  <Play className="h-4 w-4 mr-2" />
                  Start Now
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteExam(exam.id, exam.title)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Exam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Exam Header Card */}
      <ExamHeaderCard exam={exam} />

      {/* Stats Grid */}
      <ExamStatsGrid stats={stats} examDuration={exam.duration} />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 w-full">
          <TabsTrigger value="overview" className="gap-2 max-w-fit rounded-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="mcqs" className="gap-2 max-w-fit rounded-sm">
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">MCQs</span>
          </TabsTrigger>
          <TabsTrigger value="attempts" className="gap-2 max-w-fit rounded-sm">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Attempts</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 max-w-fit rounded-sm">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ExamOverviw exam={exam} stats={stats} />
        </TabsContent>
        <TabsContent value="mcqs">
          <ExamMcqsCardView mcqs={mcqs} />
        </TabsContent>
        <TabsContent value="attempts">
          <ExamAttemptsTable
            attempts={attemptsData.attempts}
            totalItems={attemptsData.totalCount}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <ExamAnalyticsCharts
            scoreDistribution={scoreDistribution}
            answerDistribution={answerDistribution}
            timeAnalysis={timeAnalysis}
            antiCheat={antiCheat}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
