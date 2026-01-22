import { GraduationCap, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

interface CourseAssociationsCardProps {
  classes: {
    className: {
      name: string;
    };
  }[];
  subjects: {
    subject: {
      name: string;
    };
  }[];
}

export const CourseAssociationsCard = ({
  classes,
  subjects,
}: CourseAssociationsCardProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Associated Classes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Associated Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {classes.map((cc, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3"
                >
                  {cc.className.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No classes associated
            </p>
          )}
        </CardContent>
      </Card>

      {/* Associated Subjects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Associated Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subjects.map((cs, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3"
                >
                  {cs.subject.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No subjects associated
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
