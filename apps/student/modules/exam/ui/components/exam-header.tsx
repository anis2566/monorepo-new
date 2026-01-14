import { Eye, Zap } from "lucide-react";
import { ExamTimer } from "./exam-timer";
import { Badge } from "@workspace/ui/components/badge";
import { useEffect, useState, useRef } from "react";

interface ExamHeaderProps {
  title: string;
  type: string;
  totalQuestions: number;
  answeredCount: number;
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

export function ExamHeader({
  title,
  type,
  totalQuestions,
  answeredCount,
  duration,
  onTimeUp,
  isActive = true,
}: ExamHeaderProps) {
  const [seconds, setSeconds] = useState(duration * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]); // Run when isActive changes

  const progress = (seconds / (duration * 60)) * 100;

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border md:hidden bg-muted">
        <div className="px-4 py-1 md:py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <ExamTimer
              initialSeconds={duration * 60}
              onTimeUp={onTimeUp}
              isPaused={!isActive}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
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
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">{type}</Badge>
            </div>
          </div>
        </div>
        <div className="relative h-[3px] bg-gray-200">
          <div
            className="absolute top-0 left-0 h-full bg-primary/80 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-card border-b border-border bg-muted">
        <div className="px-6 py-2">
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
              <ExamTimer
                initialSeconds={duration * 60}
                onTimeUp={onTimeUp}
                isPaused={!isActive}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/80 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>
    </>
  );
}
