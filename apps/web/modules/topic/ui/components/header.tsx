"use client";

import { Plus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import { useCreateTopic } from "@/hooks/use-topic";

export const Header = () => {
  const { onOpen: openCreateTopicModal } = useCreateTopic();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Topics
        </h1>
        <p className="text-sm text-muted-foreground">Manage chapter topics</p>
      </div>
      <Button
        className="gap-2 flex-1 sm:flex-none"
        onClick={openCreateTopicModal}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Topic</span>
      </Button>
    </div>
  );
};
