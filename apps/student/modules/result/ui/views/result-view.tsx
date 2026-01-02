import { ResultCard } from "@/components/result-card";
import { mockResults } from "@/data/mock";
import { PageHeader } from "@/modules/layout/ui/components/page-header";
import { Card } from "@workspace/ui/components/card";
import { TrendingUp, Award, Target, Zap } from "lucide-react";

export const ResultView = () => {
  const averageScore = Math.round(
    mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length
  );

  const bestScore = Math.max(...mockResults.map((r) => r.percentage));
  const totalCorrect = mockResults.reduce((acc, r) => acc + r.correct, 0);
  const totalQuestions = mockResults.reduce((acc, r) => acc + r.total, 0);

  return (
    <>
      <PageHeader title="Results" subtitle="Your exam performance history" />

      <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl mx-auto">
        {/* Stats Overview - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {averageScore}%
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-success">
                  {bestScore.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {mockResults.length}
                </p>
                <p className="text-sm text-muted-foreground">Exams Taken</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {totalCorrect}/{totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">
                  Questions Correct
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{averageScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {bestScore.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Best Score</p>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="space-y-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
          {mockResults.length > 0 ? (
            mockResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center text-muted-foreground">
                <p className="text-5xl mb-4">📊</p>
                <p className="font-medium text-lg">No results yet</p>
                <p className="text-sm mt-1">
                  Complete exams to see your results here
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
