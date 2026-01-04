import { LogOut, Eye, Zap } from "lucide-react";
import { ExamTimer } from "./exam-timer";
import { Button } from "@workspace/ui/components/button";

interface ExamHeaderProps {
  title: string;
  totalQuestions: number;
  answeredCount: number;
  duration: number;
  onTimeUp: () => void;
  onExit: () => void;
}

export function ExamHeader({
  title,
  totalQuestions,
  answeredCount,
  duration,
  onTimeUp,
  onExit,
}: ExamHeaderProps) {
  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-foreground">
                Q: {answeredCount}/{totalQuestions}
              </span>
              <ExamTimer initialSeconds={duration * 60} onTimeUp={onTimeUp} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-muted-foreground"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Exit
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5" />
              <span>0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Streak: 0</span>
                </div>
                <div className="text-muted-foreground">Best: 0</div>
              </div>
              <ExamTimer initialSeconds={duration * 60} onTimeUp={onTimeUp} />
              <Button variant="outline" size="sm" onClick={onExit}>
                <LogOut className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </header>
    </>
  );
}
