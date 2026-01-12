import { StudentDetailView } from "@/modules/students/ui/views/student-detail-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Details",
  description: "Student Details",
};

interface Props {
  params: Promise<{ id: string }>;
}

const StudentDetail = async ({ params }: Props) => {
  const { id } = await params;

  await Promise.all([
    prefetch(
      trpc.admin.student.getStudentDetails.queryOptions({
        studentId: id,
      })
    ),
    prefetch(
      trpc.admin.student.getStudentStats.queryOptions({
        studentId: id,
      })
    ),
    prefetch(
      trpc.admin.student.getStudentExamHistory.queryOptions({
        studentId: id,
        page: 1,
        limit: 10,
      })
    ),
    prefetch(
      trpc.admin.student.getStudentPerformanceData.queryOptions({
        studentId: id,
        months: 6,
      })
    ),
    prefetch(
      trpc.admin.student.getAnswerDistribution.queryOptions({
        studentId: id,
      })
    ),
  ]);

  return (
    <HydrateClient>
      <StudentDetailView studentId={id} />
    </HydrateClient>
  );
};

export default StudentDetail;
