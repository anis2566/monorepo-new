"use client";

import {
  Users,
  MoreHorizontal,
  GraduationCap,
  FileText,
  Edit,
  Trash,
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
import { Batch } from "@workspace/db";
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
import { useEditBatch } from "@/hooks/use-batch";

interface BatchWithRelations extends Batch {
  className: {
    name: string;
  };
  _count: {
    students: number;
    exams: number;
  };
}

interface Props {
  batches: BatchWithRelations[];
  totalCount: number;
}

export const BatchList = ({ batches, totalCount }: Props) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { onOpen: openEditBatchModal } = useEditBatch();

  const { mutate: deleteBatch } = useMutation(
    trpc.admin.batch.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.batch.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteBatch = (batchId: string, batchName: string) => {
    openDeleteModal({
      entityId: batchId,
      entityType: "batch",
      entityName: batchName,
      onConfirm: (id) => {
        deleteBatch(id);
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            All Batches ({totalCount})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id} className="py-5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {batch.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {batch.className.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3" />
                      {batch._count.students}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      {batch._count.exams}
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
                            openEditBatchModal(
                              batch.id,
                              batch.name,
                              batch.classNameId
                            )
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteBatch(batch.id, batch.name)
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
          {batches.map((batch) => (
            <MobileDataCard key={batch.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="font-medium">{batch.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {batch.className.name}
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
                        openEditBatchModal(
                          batch.id,
                          batch.name,
                          batch.classNameId
                        )
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteBatch(batch.id, batch.name)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <MobileDataRow
                  label="Students"
                  value={
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {batch._count.students}
                    </div>
                  }
                />
                <MobileDataRow
                  label="Exams"
                  value={
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {batch._count.exams}
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
