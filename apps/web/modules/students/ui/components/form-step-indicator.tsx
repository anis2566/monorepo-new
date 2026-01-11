import { Check, LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FormStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function FormStepIndicator({
  steps,
  currentStep,
  completedSteps,
}: FormStepIndicatorProps) {
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6">
        <nav aria-label="Progress">
          <ol className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;

              return (
                <li key={step.id} className="relative">
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-5 top-12 h-full w-0.5 -ml-px",
                        isCompleted ? "bg-primary" : "bg-border"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={cn(
                      "relative flex items-start gap-4 rounded-lg p-3 transition-all duration-200",
                      isCurrent && "bg-primary/5 ring-1 ring-primary/20",
                      isCompleted && !isCurrent && "opacity-80"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCurrent
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted-foreground/30 bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
