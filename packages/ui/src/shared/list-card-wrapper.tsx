import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";

import { cn } from "../lib/utils";

interface ListCardWrapperProps {
  children: React.ReactNode;
  title: string;
  value?: number;
  className?: string;
}

export const ListCardWrapper = ({
  children,
  title,
  value,
  className,
}: ListCardWrapperProps) => {
  return (
    <Card
      className={cn(
        "w-full px-2 rounded-xs p-3 gap-y-3 shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card",
        className
      )}
    >
      <CardHeader className="px-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {value !== undefined && (
              <CardDescription>{value} items found</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-y-3 w-full overflow-x-auto">
        {children}
      </CardContent>
    </Card>
  );
};
