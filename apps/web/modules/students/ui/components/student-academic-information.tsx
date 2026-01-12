import { format } from "date-fns";
import { BarChart3, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";

interface StudentAcademicInformationProps {
  student: {
    studentId: string;
    institute: string;
    className: string;
    section: string | null;
    roll: string;
    shift: string;
    batch: string | null;
    group: string;
    createdAt: string;
  };
  stats: {
    avgScore: number;
    passRate: number;
    totalTime: number;
    avgTime: number;
  };
}

export const StudentAcademicInformation = ({
  student,
  stats,
}: StudentAcademicInformationProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            Academic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-x-6">
          <InfoRow label="Student ID" value={student.studentId} />
          <InfoRow
            label="Institute"
            value={student.institute}
            icon={GraduationCap}
          />
          <InfoRow label="Class" value={student.className} />
          <InfoRow label="Section" value={student.section} />
          <InfoRow label="Roll Number" value={student.roll} />
          <InfoRow label="Shift" value={student.shift} />
          <InfoRow label="Batch" value={student.batch || "-"} />
          <InfoRow label="Group" value={student.group} />
          <InfoRow
            label="Enrolled"
            value={format(student.createdAt, "MMMM d, yyyy")}
          />
        </CardContent>
      </Card>

      {/* Quick Performance Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Quick Summary
          </CardTitle>
          <CardDescription>
            Overall exam performance at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Score</span>
              <span className="font-medium">{stats.avgScore}%</span>
            </div>
            <Progress value={stats.avgScore} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pass Rate</span>
              <span className="font-medium">{stats.passRate}%</span>
            </div>
            <Progress value={stats.passRate} className="h-2" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalTime}
              </p>
              <p className="text-xs text-muted-foreground">Total Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.avgTime}
              </p>
              <p className="text-xs text-muted-foreground">Avg. Minutes/Exam</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && (
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}
