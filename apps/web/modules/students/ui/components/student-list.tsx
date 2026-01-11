import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { Edit, Eye, GraduationCap, MoreHorizontal, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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

import { Student } from "@workspace/db";
import { Pagination } from "./pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface StudentWithRelation extends Student {
  className: {
    name: string;
  };
  batch: {
    name: string;
  } | null;
  institute: {
    name: string;
  };
}

interface StudentListProps {
  students: StudentWithRelation[];
  totalCount: number;
}

export const StudentList = ({ students, totalCount }: StudentListProps) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5 text-primary" />
          All Students ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {student.studentId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.nameBangla}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.className.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.batch?.name || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.roll}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[150px] truncate">
                    {student.institute.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(student.createdAt, "MMM d, yyyy")}
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
                          <Link href={`/students/${student.id}`}>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/students/edit/${student.id}`}>
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteStudent(student.id, student.name)
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
        <div className="lg:hidden space-y-3">
          {students.map((student: StudentWithRelation) => (
            <MobileDataCard key={student.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.nameBangla}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {student.studentId}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/students/${student.id}`}>
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/students/edit/${student.id}`}>
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        handleDeleteStudent(student.id, student.name)
                      }
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{student.className.name}</Badge>
                {student.batch && (
                  <Badge variant="secondary">{student.batch.name}</Badge>
                )}
              </div>
              <MobileDataRow label="Roll" value={student.roll} />
              <MobileDataRow
                label="Institute"
                value={
                  <span className="truncate max-w-[150px] inline-block">
                    {student.institute.name}
                  </span>
                }
              />
              <MobileDataRow
                label="Joined"
                value={format(student.createdAt, "MMM d, yyyy")}
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
