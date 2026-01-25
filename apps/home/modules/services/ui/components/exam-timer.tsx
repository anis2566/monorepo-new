"use client";

import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function ExamTimer({
  initialSeconds,
  onTimeUp,
  isPaused = false,
}: ExamTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp reference updated without re-running effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (isPaused) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          onTimeUpRef.current();
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
  }, [isPaused]); // Only depend on isPaused

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const isLowTime = seconds <= 300; // 5 minutes
  const isCritical = seconds <= 60; // 1 minute

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl font-mono font-semibold transition-colors",
        isCritical && "bg-destructive/10 text-destructive animate-pulse-soft",
        isLowTime && !isCritical && "bg-warning/10 text-warning",
        !isLowTime && "bg-primary/10 text-primary"
      )}
    >
      <Clock className="w-4 h-4" />
      <span className="text-lg">
        {String(minutes).padStart(2, "0")}:
        {String(remainingSeconds).padStart(2, "0")}
      </span>
    </div>
  );
}
