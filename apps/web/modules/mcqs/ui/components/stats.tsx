import { Card, CardContent } from "@workspace/ui/components/card";

interface StatsProps {
  totalMcqs: number;
  singleMcqs: number;
  multipleMcqs: number;
  contextualMcqs: number;
}

export const Stats = ({
  totalMcqs,
  singleMcqs,
  multipleMcqs,
  contextualMcqs,
}: StatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {totalMcqs}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Total MCQs</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-success">
            {singleMcqs}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Single</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-warning">
            {multipleMcqs}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Multiple</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
            {contextualMcqs}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Contextual</p>
        </CardContent>
      </Card>
    </div>
  );
};
