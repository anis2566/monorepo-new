import { Button } from "@workspace/ui/components/button";
import { CheckCircle2, PartyPopper, Rocket } from "lucide-react";

interface SuccessStepProps {
  onComplete: () => void;
}

export const SuccessStep = ({ onComplete }: SuccessStepProps) => {
  return (
    <div className="flex flex-col items-center text-center px-4 animate-fade-in">
      {/* Success Animation */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-success-foreground" />
        </div>
        <PartyPopper className="absolute -top-2 -right-3 w-8 h-8 text-celebration-start animate-float" />
        <Rocket
          className="absolute -bottom-2 -left-4 w-7 h-7 text-celebration-end animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-bold text-foreground mb-2">
        You&apos;re All Set! 🚀
      </h1>
      <p className="text-muted-foreground mb-8 max-w-xs">
        Your student account is now verified and ready to use. Welcome to the
        community!
      </p>

      {/* What's Next */}
      <div className="w-full p-4 bg-success/5 rounded-2xl border border-success/20 mb-8">
        <h3 className="font-semibold text-foreground mb-3 text-sm">
          What&apos;s Next?
        </h3>
        <ul className="space-y-2 text-left">
          <NextItem text="Explore exclusive student discounts" />
          <NextItem text="Browse premium study resources" />
          <NextItem text="Connect with other students" />
        </ul>
      </div>

      {/* CTA */}
      <Button size="xl" onClick={onComplete} className="w-full">
        Start Exploring
      </Button>
    </div>
  );
};

const NextItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 text-sm text-muted-foreground">
    <div className="w-1.5 h-1.5 bg-success rounded-full shrink-0" />
    {text}
  </li>
);
