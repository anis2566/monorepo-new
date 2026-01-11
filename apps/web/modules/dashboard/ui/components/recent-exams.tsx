import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ClipboardList,
  Eye,
  MoreHorizontal,
  Pencil,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

interface RecentExam {
  id: string;
  title: string;
  type: string;
  duration: number;
  status: "Pending" | "Upcoming" | "Ongoing" | "Completed";
  attemptCount: number;
  avgScore: number;
}

interface RecentExamsProps {
  exams: RecentExam[];
}

const statusColors = {
  Pending: "bg-muted text-muted-foreground border-border",
  Upcoming: "bg-warning/10 text-warning border-warning/20",
  Ongoing: "bg-success/10 text-success border-success/20",
  Completed: "bg-muted text-muted-foreground border-border",
} as const;

export function RecentExams({ exams }: RecentExamsProps) {
  if (!exams || exams.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
              Recent Exams
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No exams found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Recent Exams
          </CardTitle>
          <Link href="/exams">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.slice(0, 5).map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {exam.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.duration} min
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[exam.status]}
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.attemptCount}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.avgScore > 0 ? `${exam.avgScore}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/exams/${exam.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/exams/${exam.id}/edit`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Exam
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/exams/${exam.id}/results`}
                            className="flex items-center cursor-pointer"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Results
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
