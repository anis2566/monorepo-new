import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 px-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                isCompleted && "bg-success text-success-foreground",
                isActive && "bg-primary text-primary-foreground shadow-md",
                !isCompleted &&
                  !isActive &&
                  "bg-step-inactive text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1 transition-all duration-300",
                  stepNumber < currentStep ? "bg-success" : "bg-step-inactive"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
