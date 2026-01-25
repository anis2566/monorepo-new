"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Trash2,
  FileText,
  ListChecks,
  Users,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { ExamStatsGrid } from "../components/exam-stats-grid";
import { ExamAnalyticsCharts } from "../components/exam-analytics-charts";
import { ExamMcqsCardView } from "../components/exam-mcqs";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { PublicExamHeaderCard } from "../components/public-exam-header-card";
import { PublicExamOverviw } from "../components/public-exam-overview";
import { PublicExamAttemptsTable } from "../components/public-exam-attempts-table";

interface PublicExamDetailViewProps {
  examId: string;
}

export const PublicExamDetailView = ({ examId }: PublicExamDetailViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { openDeleteModal } = useDeleteModal();
  const queryClient = useQueryClient();

  const { data: exam } = useSuspenseQuery(
    trpc.admin.publicExam.getExamDetails.queryOptions({ examId }),
  );

  const { data: stats } = useSuspenseQuery(
    trpc.admin.publicExam.getExamStats.queryOptions({ examId }),
  );

  const { data: attemptsData } = useSuspenseQuery(
    trpc.admin.publicExam.getExamAttempts.queryOptions({
      examId,
      limit: 10,
    }),
  );

  const { data: mcqs } = useSuspenseQuery(
    trpc.admin.publicExam.getExamMcqs.queryOptions({ examId }),
  );

  const { data: scoreDistribution } = useSuspenseQuery(
    trpc.admin.publicExam.getScoreDistribution.queryOptions({ examId }),
  );

  const { data: answerDistribution } = useSuspenseQuery(
    trpc.admin.publicExam.getAnswerDistribution.queryOptions({ examId }),
  );

  const { data: timeAnalysis } = useSuspenseQuery(
    trpc.admin.publicExam.getTimeAnalysis.queryOptions({ examId }),
  );

  const { data: antiCheat } = useSuspenseQuery(
    trpc.admin.publicExam.getAntiCheatSummary.queryOptions({ examId }),
  );

  const { mutate: deleteExam } = useMutation(
    trpc.admin.publicExam.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.publicExam.getMany.queryKey(),
        });
      },
    }),
  );

  const handleDeleteExam = (examId: string, examName: string) => {
    openDeleteModal({
      entityId: examId,
      entityType: "publicExam",
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
            <Link href={`/exams/public/edit/${exam.id}`}>
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
              {/* <DropdownMenuItem>
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
              )} */}
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
      <PublicExamHeaderCard exam={exam} />

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
          <PublicExamOverviw exam={exam} stats={stats} />
        </TabsContent>
        <TabsContent value="mcqs">
          <ExamMcqsCardView mcqs={mcqs} />
        </TabsContent>
        <TabsContent value="attempts">
          <PublicExamAttemptsTable
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
