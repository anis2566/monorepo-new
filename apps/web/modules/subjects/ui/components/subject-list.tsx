"use client";

import {
  BookOpen,
  MoreHorizontal,
  Layers,
  FileQuestion,
  Trash,
  Edit,
} from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Subject } from "@workspace/db";
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

import { Pagination } from "./pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useEditSubject } from "@/hooks/use-subject";

interface SubjectWithRelations extends Subject {
  _count: {
    chapters: number;
    mcqs: number;
  };
}

interface SubjectListProps {
  subjects: SubjectWithRelations[];
  totalCount: number;
}

const levelColors: Record<string, string> = {
  SSC: "bg-primary/10 text-primary border-primary/20",
  HSC: "bg-accent/10 text-accent border-accent/20",
  Degree: "bg-warning/10 text-warning border-warning/20",
  Masters: "bg-success/10 text-success border-success/20",
  Elementary: "bg-muted text-muted-foreground border-border",
  Intermediate: "bg-info/10 text-info border-info/20",
};

export const SubjectList = ({ subjects, totalCount }: SubjectListProps) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { onOpen: openEditModal } = useEditSubject();

  const { mutate: deleteSubject } = useMutation(
    trpc.admin.subject.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.subject.getMany.queryKey(),
        });
      },
    }),
  );

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    openDeleteModal({
      entityId: subjectId,
      entityType: "subject",
      entityName: subjectName,
      onConfirm: (id) => {
        deleteSubject({ id });
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            All Subjects ({totalCount})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Chapters</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>MCQs</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id} className="py-5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {subject.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        levelColors[subject.level] ||
                        "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {subject.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3" />
                      {subject._count.chapters}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {subject.position}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-3 w-3" />
                      {subject._count.mcqs}
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
                        <DropdownMenuItem
                          onClick={() =>
                            openEditModal(
                              subject.id,
                              subject.name,
                              subject.level,
                              subject.position.toString(),
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteSubject(subject.id, subject.name)
                          }
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
        <div className="md:hidden space-y-3">
          {subjects.map((subject) => (
            <MobileDataCard key={subject.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p className="font-medium">{subject.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      levelColors[subject.level] ||
                      "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {subject.level}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        openEditModal(
                          subject.id,
                          subject.name,
                          subject.level,
                          subject.position.toString(),
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        handleDeleteSubject(subject.id, subject.name)
                      }
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <MobileDataRow
                  label="Chapters"
                  value={
                    <div className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {subject._count.chapters}
                    </div>
                  }
                />
                <MobileDataRow
                  label="Questions"
                  value={
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" />
                      {subject._count.mcqs}
                    </div>
                  }
                />
              </div>
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
