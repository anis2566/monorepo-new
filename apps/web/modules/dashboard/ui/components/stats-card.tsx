import { Card, CardContent } from "@workspace/ui/components/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning";
}

const variantStyles = {
  default: "bg-muted/50 text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const borderStyles = {
  default: "",
  primary: "border-l-4 border-l-primary",
  accent: "border-l-4 border-l-accent",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "shadow-card hover:shadow-lg transition-all duration-200 group",
        borderStyles[variant]
      )}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "rounded-xl p-3 transition-transform group-hover:scale-110",
              variantStyles[variant]
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
