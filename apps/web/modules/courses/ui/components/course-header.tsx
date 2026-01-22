"use client";

import { Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

import { Course } from "@workspace/db";
import { useDeleteModal } from "@/hooks/use-delete-modal";

interface CourseHeaderProps {
  course: Course | undefined;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openDeleteModal } = useDeleteModal();

  const { mutate: deleteCourse } = useMutation(
    trpc.admin.course.deleteOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error("Failed to delete course");
          return;
        }

        toast.success("Course deleted successfully");

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.course.getMany.queryKey(),
        });
      },
    }),
  );

  if (!course) {
    return null;
  }

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    openDeleteModal({
      entityId: courseId,
      entityType: "course",
      entityName: courseName,
      onConfirm: (id) => {
        deleteCourse({ id });
      },
    });
  };

  const getStatusBadge = () => {
    if (!course.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (course.isPopular) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          Popular
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        Active
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {course.name}
          </h1>
          {getStatusBadge()}
          {course.isPopular && (
            <Badge className="bg-amber-500 text-white shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <Badge variant="outline" className="mt-1">
          {course.type}
        </Badge>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/courses/edit/${course.id}`}>
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteCourse(course.id, course.name)}
        >
          <Trash2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
};
