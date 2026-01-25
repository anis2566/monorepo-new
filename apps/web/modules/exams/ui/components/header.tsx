import { Globe, Plus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Exams</h1>
        <p className="text-sm text-muted-foreground">Create & Manage exams</p>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline" className="gap-2 flex-1 sm:flex-none">
          <Link href="/exams/new/public">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Create Public Exam</span>
            <span className="sm:hidden">Public</span>
          </Link>
        </Button>
        <Button asChild className="gap-2 flex-1 sm:flex-none">
          <Link href="/exams/new">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Exam</span>
            <span className="sm:hidden">Exam</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
