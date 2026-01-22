import {
  Users,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Course } from "@workspace/db";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { Pagination } from "./pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CourseWithRelations extends Course {
  subjects: {
    subject: {
      name: string;
    };
  }[];
  classes: {
    className: {
      name: string;
    };
  }[];
}

interface CoursesProps {
  courses: CourseWithRelations[];
  totalCount: number;
}

export const CoursesList = ({ courses, totalCount }: CoursesProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  const getStatusBadge = (course: Course) => {
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

  const renderMobileCard = (course: CourseWithRelations) => (
    <MobileDataCard
      key={course.id}
      onClick={() => router.push(`/courses/${course.id}`)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{course.name}</h3>
            <p className="text-sm text-muted-foreground">{course.type}</p>
          </div>
          {getStatusBadge(course)}
        </div>
        <div className="space-y-1">
          <MobileDataRow label="Duration" value={`${course.duration} months`} />
          <MobileDataRow
            label="Price"
            value={formatPrice(Number(course.price))}
          />
          <MobileDataRow label="Enrollments" value={0} />
          <MobileDataRow label="Classes" value={course.classes.length} />
          <MobileDataRow label="Subjects" value={course.subjects.length} />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course.id}`);
            }}
          >
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course.id}/edit`);
            }}
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCourse(course.id, course.name);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </MobileDataCard>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            All Courses ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="p-4 space-y-4">
              {courses.map(renderMobileCard)}
              {courses.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No courses found matching your criteria.
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Subjects</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {course.tagline || course.description?.slice(0, 50)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {course.duration} months
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatPrice(Number(course.price))}
                        </div>
                        {Number(course.discount) > 0 && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(Number(course.originalPrice))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        {0}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(course)}</TableCell>
                    <TableCell>
                      {course.startDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {format(course.startDate, "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.classes.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-muted-foreground" />
                          {course.classes.length}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.subjects.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-muted-foreground" />
                          {course.subjects.length}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem
                            onClick={() => router.push(`/courses/${course.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/courses/edit/${course.id}`)
                            }
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteCourse(course.id, course.name)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No courses found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <Pagination totalCount={totalCount} />
        </CardContent>
      </Card>

      {/* Pagination */}
    </div>
  );
};
