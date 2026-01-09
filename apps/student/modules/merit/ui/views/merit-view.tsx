import { GraduationCap } from "lucide-react";

export const MeritView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Merit List</h1>
              <p className="text-sm text-muted-foreground">
                Exam Results & Rankings
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
