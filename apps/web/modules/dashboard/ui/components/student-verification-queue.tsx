import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { UserCheck, Clock, CheckCircle, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PendingStudent {
  id: string;
  name: string;
  imageUrl?: string;
  studentId: string;
  className: string;
  institute: string;
  submittedAt: Date;
}

interface StudentVerificationQueueProps {
  students: PendingStudent[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function StudentVerificationQueue({
  students,
  onApprove,
  onReject,
}: StudentVerificationQueueProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Verification Queue
          </CardTitle>
          <span className="bg-warning/10 text-warning text-xs font-semibold px-2 py-1 rounded-full">
            {students.length} pending
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          students.slice(0, 3).map((student) => (
            <div
              key={student.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.imageUrl} alt={student.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {student.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {student.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: {student.studentId} • {student.className}
                </p>
                <p className="text-xs text-muted-foreground">
                  {student.institute}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(student.submittedAt, {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-success/20 hover:bg-success/10 hover:text-success"
                  onClick={() => onApprove(student.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onReject(student.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}

        {students.length > 3 && (
          <Button variant="outline" className="w-full" size="sm">
            View All {students.length} Pending
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
