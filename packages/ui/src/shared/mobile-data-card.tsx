import { ReactNode } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface MobileDataCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileDataCard({
  children,
  className,
  onClick,
}: MobileDataCardProps) {
  return (
    <Card
      className={cn(
        "shadow-sm hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

interface MobileDataRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function MobileDataRow({ label, value, className }: MobileDataRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
