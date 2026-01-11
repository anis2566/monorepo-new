import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Plus, FileText, Users, Zap, Layers3, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      label: "Add Student",
      icon: Users,
      href: "/students/new",
      color: "text-success",
      bgColor: "bg-success/10 group-hover:bg-success/20",
    },
    {
      label: "Create Exam",
      icon: Plus,
      href: "/exams/new",
      color: "text-primary",
      bgColor: "bg-primary/10 group-hover:bg-primary/20",
    },
    {
      label: "Add MCQs",
      icon: FileText,
      href: "/mcqs/new",
      color: "text-accent",
      bgColor: "bg-accent/10 group-hover:bg-accent/20",
    },
    {
      label: "Add Batch",
      icon: Layers3,
      href: "/batches/new",
      color: "text-warning",
      bgColor: "bg-warning/10 group-hover:bg-warning/20",
    },
  ];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-between group hover:border-primary/50 transition-all h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 transition-colors ${action.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
