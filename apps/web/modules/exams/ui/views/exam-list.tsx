"use client";

import {
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  Layers3,
  School,
  Trash,
  Users,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Exam } from "@workspace/db";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";

import { Pagination } from "../components/pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface ExamWithRelations extends Exam {
  subjects: {
    subject: {
      name: string;
    };
  }[];
  _count: {
    attempts: number;
    students: number;
    batches: number;
    classNames: number;
    subjects: number;
  };
}

interface ExamListProps {
  exams: ExamWithRelations[];
  totalCount: number;
}

const statusColors: Record<string, string> = {
  Ongoing: "bg-success/10 text-success border-success/20",
  Upcoming: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-muted text-muted-foreground border-border",
};

export const ExamList = ({ exams, totalCount }: ExamListProps) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-primary" />
          All Exams ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{exam.title}</p>
                      <div className="flex gap-1 mt-1">
                        {exam.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {exam.subjects
                              .map((subject) => subject.subject.name)
                              .join(", ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(exam.startDate, "MMM d")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {exam.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[exam.status]}
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <School className="h-3 w-3" />
                      {exam._count.classNames}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Layers3 className="h-3 w-3" />
                      {exam._count.batches}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {exam._count.subjects}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {exam._count.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {exam._count.attempts}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/edit/${exam.id}`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/merit/${exam.id}`}>
                            <Crown className="h-4 w-4" />
                            Merit List
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteExam(exam.id, exam.title)}
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {exams.map((exam) => (
            <MobileDataCard key={exam.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium">{exam.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exam.subjects.map((subject, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {subject.subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/exams/${exam.id}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/exams/edit/${exam.id}`}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteExam(exam.id, exam.title)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={statusColors[exam.status]}>
                  {exam.status}
                </Badge>
                <Badge variant="outline">{exam.type}</Badge>
              </div>
              <MobileDataRow
                label="Schedule"
                value={
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(exam.startDate, "MMM d, yyyy")}
                  </span>
                }
              />
              <MobileDataRow label="Duration" value={`${exam.duration} min`} />
              <MobileDataRow label="Classes" value={exam._count.classNames} />
              <MobileDataRow label="Batches" value={exam._count.batches} />
              <MobileDataRow label="Subjects" value={exam._count.subjects} />
              <MobileDataRow label="Students" value={exam._count.students} />
              <MobileDataRow label="Attempts" value={exam._count.attempts} />
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
