"use client";

import {
  BookOpen,
  MoreHorizontal,
  FileQuestion,
  ListOrdered,
  Edit,
  Trash,
  Layers3,
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
import { Chapter } from "@workspace/db";
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
import { useEditChapter } from "@/hooks/use-chapter";
import Link from "next/link";

interface ChapterWithRelations extends Chapter {
  subject: {
    name: string;
    id: string;
  };
  _count: {
    mcqs: number;
  };
}

interface Props {
  chapters: ChapterWithRelations[];
  totalCount: number;
}

export const ChapterList = ({ chapters, totalCount }: Props) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { onOpen: openEditModal } = useEditChapter();

  const { mutate: deleteChapter } = useMutation(
    trpc.admin.chapter.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.chapter.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteChapter = (chapterId: string, chapterName: string) => {
    openDeleteModal({
      entityId: chapterId,
      entityType: "chapter",
      entityName: chapterName,
      onConfirm: (id) => {
        deleteChapter({ id });
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers3 className="h-5 w-5 text-primary" />
            All Chapters ({totalCount})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>MCQs</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.map((chapter, index) => (
                <TableRow key={chapter.id} className="py-5">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {chapter.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {chapter.subject.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground border-border"
                    >
                      <ListOrdered className="h-3 w-3 mr-1" />
                      {chapter.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-3 w-3" />
                      {chapter._count.mcqs}
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
                              chapter.id,
                              chapter.name,
                              chapter.position.toString(),
                              chapter.subject.id
                            )
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/chapters/${chapter.id}/new`}>
                            <BookOpen className="h-4 w-4" />
                            New MCQs
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteChapter(chapter.id, chapter.name)
                          }
                        >
                          <Trash className="h-4 w-4 mr-2" />
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
          {chapters.map((chapter) => (
            <MobileDataCard key={chapter.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground border-border"
                    >
                      <ListOrdered className="h-3 w-3 mr-1" />
                      {chapter.position}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p className="font-medium">{chapter.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {chapter.subject.name}
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
                          chapter.id,
                          chapter.name,
                          chapter.position.toString(),
                          chapter.subject.id
                        )
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/chapters/${chapter.id}/new`}>
                        <BookOpen className="h-4 w-4" />
                        New MCQs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        handleDeleteChapter(chapter.id, chapter.name)
                      }
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <MobileDataRow
                  label="Questions"
                  value={
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" />
                      {chapter._count.mcqs}
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
