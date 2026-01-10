"use client";

import { Plus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import { useCreateInstitute } from "@/hooks/use-institute";

export const Header = () => {
  const { onOpen: openCreateInstituteModal } = useCreateInstitute();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Institutes
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage academic institutes
        </p>
      </div>
      <Button
        className="gap-2 flex-1 sm:flex-none"
        onClick={openCreateInstituteModal}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Institute</span>
      </Button>
    </div>
  );
};
