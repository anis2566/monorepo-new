"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Users,
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  Building,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { Teacher } from "@workspace/db";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";
import { Pagination } from "./pagination";
import Link from "next/link";

interface TeacherListProps {
  teachers: Teacher[];
  totalCount: number;
}

export const TeacherList = ({ teachers, totalCount }: TeacherListProps) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteTeacher } = useMutation(
    trpc.admin.teacher.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.teacher.getMany.queryKey(),
        });
      },
    }),
  );

  const handleDeleteTeacher = (teacherId: string, teacherName: string) => {
    openDeleteModal({
      entityId: teacherId,
      entityType: "teacher",
      entityName: teacherName,
      onConfirm: (id: string) => {
        deleteTeacher({ id });
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          All Teachers ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/teachers/${teacher.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={teacher.imageUrl}
                          alt={teacher.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(teacher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-3.5 w-3.5" />
                      {teacher.institute}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-primary/5 border-primary/20"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      {teacher.subject}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(teacher.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link href={`/teachers/${teacher.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link href={`/teachers/edit/${teacher.id}`}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteTeacher(teacher.id, teacher.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
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
          {teachers.map((teacher) => (
            <MobileDataCard
              key={teacher.id}
              onClick={() => router.push(`/teachers/${teacher.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.imageUrl} alt={teacher.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <Badge
                      variant="outline"
                      className="mt-1 bg-primary/5 border-primary/20"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      {teacher.subject}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => router.push(`/teachers/${teacher.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive"
                      onClick={() =>
                        handleDeleteTeacher(teacher.id, teacher.name)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <MobileDataRow
                label="Institute"
                value={
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {teacher.institute}
                  </span>
                }
              />
              <MobileDataRow
                label="Joined"
                value={format(new Date(teacher.createdAt), "MMM d, yyyy")}
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
