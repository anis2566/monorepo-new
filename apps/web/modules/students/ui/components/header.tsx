import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

export const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Students
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage student profiles and enrollments
        </p>
      </div>
      <Button className="gap-2 flex-1 sm:flex-none" asChild>
        <Link href="/students/new">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Student</span>
        </Link>
      </Button>
    </div>
  );
};
