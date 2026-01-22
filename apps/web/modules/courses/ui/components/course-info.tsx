import { format } from "date-fns";

import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Course } from "@workspace/db";

interface CourseInfoCardProps {
  course: Course | undefined;
}

export const CourseInfoCard = ({ course }: CourseInfoCardProps) => {
  if (!course) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Course Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              Type
            </label>
            <p className="mt-1">
              <Badge variant="outline">{course.type}</Badge>
            </p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              Pricing Cycle
            </label>
            <p className="mt-1 text-sm sm:text-base font-medium">
              {course.pricingLifeCycle}
            </p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <p className="mt-1 text-sm sm:text-base font-medium">
              {course.startDate
                ? format(course.startDate, "MMM d, yyyy")
                : "Not set"}
            </p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <p className="mt-1 text-sm sm:text-base font-medium">
              {course.endDate
                ? format(course.endDate, "MMM d, yyyy")
                : "Not set"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hero Title
            </label>
            <p className="mt-1 text-sm sm:text-base font-medium">
              {course.heroTitle || "Not set"}
            </p>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hero Description
            </label>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
              {course.heroDescription || "Not set"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {course.tagline && (
              <Badge variant="secondary" className="text-xs">
                {course.tagline}
              </Badge>
            )}
          </div>
        </div>

        {course.urgencyMessage && (
          <>
            <Separator />
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <label className="text-xs sm:text-sm font-medium text-amber-600">
                Urgency Message
              </label>
              <p className="mt-1 text-sm text-amber-700">
                {course.urgencyMessage}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
