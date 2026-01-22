import { Star, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

import { Course } from "@workspace/db";

interface CourseFeaturesCardProps {
  course: Course | undefined;
}

export const CourseFeaturesCard = ({ course }: CourseFeaturesCardProps) => {
  if (!course) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Features</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Key features displayed on the course page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {course.features.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {course.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                  {feature}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No features added</p>
          )}
        </CardContent>
      </Card>

      {/* Special Benefits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Special Benefits</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Additional benefits for enrolled students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {course.specialBenefits.length > 0 ? (
            <div className="space-y-2">
              {course.specialBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg"
                >
                  <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No special benefits added
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
