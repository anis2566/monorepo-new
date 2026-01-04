import { useState } from "react";
import { Grid3X3 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { cn } from "@workspace/ui/lib/utils";

interface MobileQuickJumpProps {
  totalQuestions: number;
  getAnswerState: (index: number) => "unanswered" | "correct" | "incorrect";
  stats: {
    score: number;
    wrong: number;
  };
  answeredCount: number;
}

export function MobileQuickJump({
  totalQuestions,
  getAnswerState,
  stats,
  answeredCount,
}: MobileQuickJumpProps) {
  const [open, setOpen] = useState(false);

  const handleJumpToQuestion = (index: number) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(`question-${index + 1}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="lg:hidden fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <Grid3X3 className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle>Jump to Question</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success/20 border-2 border-success" />
              <span className="text-muted-foreground">{stats.score}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/20 border-2 border-destructive" />
              <span className="text-muted-foreground">{stats.wrong}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-muted" />
              <span className="text-muted-foreground">
                {totalQuestions - answeredCount}
              </span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const state = getAnswerState(index);
              return (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  className={cn(
                    "aspect-square rounded-lg font-medium text-sm transition-all duration-200 active:scale-95",
                    state === "unanswered" && "bg-muted text-muted-foreground",
                    state === "correct" &&
                      "bg-success/20 text-success border-2 border-success",
                    state === "incorrect" &&
                      "bg-destructive/20 text-destructive border-2 border-destructive"
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
