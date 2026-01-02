import { cn } from "@workspace/ui/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  rightElement,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  );
}
