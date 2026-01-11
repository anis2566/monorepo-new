import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ClipboardCheck,
  UserPlus,
  FileText,
  Plus,
  CheckCircle,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { RecentActivity } from "@/data/mock-data";
import { Button } from "@workspace/ui/components/button";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

const activityIcons = {
  exam_created: FileText,
  student_registered: UserPlus,
  exam_submitted: ClipboardCheck,
  mcq_added: Plus,
  user_verified: CheckCircle,
};

const activityColors = {
  exam_created: "bg-primary/10 text-primary border-primary/20",
  student_registered: "bg-accent/10 text-accent border-accent/20",
  exam_submitted: "bg-success/10 text-success border-success/20",
  mcq_added: "bg-warning/10 text-warning border-warning/20",
  user_verified: "bg-success/10 text-success border-success/20",
};

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 pb-3 transition-colors hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg",
                index !== activities.length - 1 && "border-b border-border"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2.5 shrink-0 border transition-transform hover:scale-110",
                  activityColors[activity.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
