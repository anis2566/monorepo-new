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
  Download,
  Mail,
  Send,
  User,
  GraduationCap,
  FileText,
  BarChart3,
} from "lucide-react";
import { StudentProfileCard } from "../components/student-profile-card";
import { StudentStatsGrid } from "../components/student-stats-grid";
import { StudentExamHistory } from "../components/student-exam-history";
import { StudentPerformanceChart } from "../components/student-performance-chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { StudentPersonalInformation } from "../components/student-personal-information";
import { StudentAcademicInformation } from "../components/student-academic-information";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface StudentDetailViewProps {
  studentId: string;
}

export const StudentDetailView = ({ studentId }: StudentDetailViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { openDeleteModal } = useDeleteModal();
  const queryClient = useQueryClient();

  const { data: student } = useSuspenseQuery(
    trpc.admin.student.getStudentDetails.queryOptions({ studentId })
  );

  const { data: stats } = useSuspenseQuery(
    trpc.admin.student.getStudentStats.queryOptions({ studentId })
  );

  const { data: examHistory } = useSuspenseQuery(
    trpc.admin.student.getStudentExamHistory.queryOptions({
      studentId,
      page: 1,
      limit: 10,
    })
  );

  const { data: performanceData } = useSuspenseQuery(
    trpc.admin.student.getStudentPerformanceData.queryOptions({
      studentId,
      months: 6,
    })
  );

  const { data: answerDistribution } = useSuspenseQuery(
    trpc.admin.student.getAnswerDistribution.queryOptions({ studentId })
  );

  const { mutate: deleteStudent } = useMutation(
    trpc.admin.student.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.student.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    openDeleteModal({
      entityId: studentId,
      entityType: "student",
      entityName: studentName,
      onConfirm: (id) => {
        deleteStudent(id);
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
            onClick={() => router.push("/students")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Student Details
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage student information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/students/edit/${student.id}`}>
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
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="h-4 w-4 mr-2" />
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteStudent(student.id, student.name)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Card */}
      <StudentProfileCard student={student} />

      {/* Stats Grid */}
      <StudentStatsGrid stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 w-full">
          <TabsTrigger value="overview" className="gap-2 max-w-fit rounded-sm">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2 max-w-fit rounded-sm">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="gap-2 max-w-fit rounded-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Exam History</span>
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="gap-2 max-w-fit rounded-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <StudentPersonalInformation student={student} />
        </TabsContent>
        <TabsContent value="academic">
          <StudentAcademicInformation student={student} stats={stats} />
        </TabsContent>
        <TabsContent value="exams">
          <StudentExamHistory attempts={examHistory.attempts} />
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <StudentPerformanceChart
            data={performanceData}
            answerDistribution={answerDistribution}
            stats={{
              totalTime: stats.totalTime,
              totalCorrect: stats.totalCorrect,
              totalWrong: stats.totalWrong,
              bestStreak: stats.bestStreak,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
