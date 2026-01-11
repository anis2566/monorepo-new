import { LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface MobileStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function MobileStepIndicator({
  steps,
  currentStep,
  completedSteps,
}: MobileStepIndicatorProps) {
  return (
    <div className="lg:hidden mb-6">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full shrink-0 transition-all duration-200",
                  isCompleted
                    ? "bg-primary w-2"
                    : isCurrent
                      ? "bg-primary w-4"
                      : "bg-muted-foreground/30"
                )}
              />
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 transition-all duration-200",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step info */}
      {steps.map((step) => {
        if (currentStep !== step.id) return null;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Step {step.id} of {steps.length}
              </p>
              <p className="font-semibold text-foreground">{step.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
