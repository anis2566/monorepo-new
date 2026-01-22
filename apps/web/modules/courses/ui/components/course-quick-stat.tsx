import { Users, Clock, BookOpen, Percent } from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Course } from "@workspace/db";

interface CourseQuickStatsProps {
  course: Course | undefined;
}

export const CourseQuickStats = ({ course }: CourseQuickStatsProps) => {
  if (!course) {
    return null;
  }

  const stats = [
    {
      icon: Users,
      value: 0,
      label: "Enrollments",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Clock,
      value: `${course.duration}`,
      label: "Months",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: BookOpen,
      value: course.totalClasses || "N/A",
      label: "Classes",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Percent,
      value: `${course.discount}%`,
      label: "Discount",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 ${stat.bg} rounded-lg shrink-0`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold truncate">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
