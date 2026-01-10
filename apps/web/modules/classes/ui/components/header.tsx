"use client";

import { Plus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { useCreateClass } from "@/hooks/use-class";

export const Header = () => {
  const { onOpen: openCreateClassModal } = useCreateClass();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Classes
        </h1>
        <p className="text-sm text-muted-foreground">Manage classes</p>
      </div>
      <Button
        className="gap-2 flex-1 sm:flex-none"
        onClick={openCreateClassModal}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Class</span>
      </Button>
    </div>
  );
};
