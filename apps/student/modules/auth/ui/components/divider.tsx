import { cn } from "@workspace/ui/lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className }: DividerProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex-grow border-t border-border" />
      {text && (
        <span className="mx-4 flex-shrink text-xs text-muted-foreground uppercase tracking-wider">
          {text}
        </span>
      )}
      <div className="flex-grow border-t border-border" />
    </div>
  );
}
