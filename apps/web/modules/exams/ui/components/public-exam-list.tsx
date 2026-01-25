"use client";

import { useState } from "react";
import {
  Calendar,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  Trash,
  Users,
  MoreHorizontal,
  Crown,
  FileQuestionIcon,
  Globe,
  Copy,
  Check,
  Shuffle,
  AlertCircle,
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
import { PublicExam } from "@workspace/db";
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

import { Pagination } from "./public-exam-pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface PublicExamWithRelations extends PublicExam {
  subjects: {
    subject: {
      name: string;
    };
  }[];
  _count: {
    attempts: number;
  };
}

interface PublicExamListProps {
  exams: PublicExamWithRelations[];
  totalCount: number;
}

const statusColors: Record<string, string> = {
  Ongoing: "bg-success/10 text-success border-success/20",
  Upcoming: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-muted text-muted-foreground border-border",
};

export const PublicExamList = ({ exams, totalCount }: PublicExamListProps) => {
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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPublicLink = (examId: string) => {
    const publicUrl = `https://mrdr.education/exams/${examId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedId(examId);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
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
                <TableHead>Features</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <p className="font-medium">{exam.title}</p>
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {exam.subjects.map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.subject.name}
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
                    <div className="flex gap-1">
                      {exam.hasSuffle && (
                        <Badge variant="outline" className="text-xs">
                          <Shuffle className="h-3 w-3 mr-1" />
                          Shuffle
                        </Badge>
                      )}
                      {exam.hasNegativeMark && (
                        <Badge
                          variant="outline"
                          className="text-xs text-warning border-warning/30"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />-
                          {exam.negativeMark}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-primary font-medium">
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
                          <Link href={`/exams/public/${exam.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/public/edit/${exam.id}`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/public/${exam.id}/question`}>
                            <FileQuestionIcon className="h-4 w-4" />
                            Assign Question
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/public/merit/${exam.id}`}>
                            <Crown className="h-4 w-4" />
                            Merit List
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyPublicLink(exam.id)}
                        >
                          {copiedId === exam.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {copiedId === exam.id
                            ? "Copied!"
                            : "Copy Public Link"}
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
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <p className="font-medium">{exam.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exam.subjects.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item.subject.name}
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
                      <Link href={`/exams/public/${exam.id}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/exams/public/edit/${exam.id}`}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/exams/public/${exam.id}/question`}>
                        <FileQuestionIcon className="h-4 w-4" />
                        Assign Question
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/exams/public/merit/${exam.id}`}>
                        <Crown className="h-4 w-4" />
                        Merit List
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyPublicLink(exam.id)}
                    >
                      {copiedId === exam.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedId === exam.id ? "Copied!" : "Copy Public Link"}
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
                {exam.hasSuffle && (
                  <Badge variant="outline" className="text-xs">
                    <Shuffle className="h-3 w-3 mr-1" />
                    Shuffle
                  </Badge>
                )}
                {exam.hasNegativeMark && (
                  <Badge
                    variant="outline"
                    className="text-xs text-warning border-warning/30"
                  >
                    -{exam.negativeMark}
                  </Badge>
                )}
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
              <MobileDataRow
                label="Participants"
                value={
                  <span className="text-primary font-medium">
                    {exam._count.attempts}
                  </span>
                }
              />
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
