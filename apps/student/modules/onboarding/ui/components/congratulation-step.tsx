import { Button } from "@workspace/ui/components/button";
import { GraduationCap, Sparkles, Star, Trophy } from "lucide-react";

interface CongratulationsStepProps {
  onNext: () => void;
}

export const CongratulationsStep = ({ onNext }: CongratulationsStepProps) => {
  return (
    <div className="flex flex-col items-center text-center px-4 animate-fade-in">
      {/* Celebration Icons */}
      <div className="relative mb-6">
        <div className="w-24 h-24 gradient-celebration rounded-full flex items-center justify-center animate-float shadow-xl">
          <GraduationCap className="w-12 h-12 text-primary-foreground" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-celebration-start animate-pulse-soft" />
        <Star className="absolute -bottom-1 -left-3 w-5 h-5 text-celebration-end animate-pulse-soft" />
        <Trophy className="absolute top-0 -left-4 w-5 h-5 text-success animate-pulse-soft" />
      </div>

      {/* Congratulations Text */}
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Congratulations! 🎉
      </h1>
      <p className="text-muted-foreground mb-6 max-w-xs">
        Your student account has been approved! Let&apos;s complete your profile
        to unlock all features.
      </p>

      {/* Features List */}
      <div className="w-full space-y-3 mb-8">
        <FeatureItem
          icon={<Star className="w-5 h-5" />}
          title="Exclusive Discounts"
          description="Get up to 50% off on courses"
        />
        <FeatureItem
          icon={<Trophy className="w-5 h-5" />}
          title="Premium Resources"
          description="Access study materials & guides"
        />
        <FeatureItem
          icon={<Sparkles className="w-5 h-5" />}
          title="Community Access"
          description="Connect with fellow students"
        />
      </div>

      {/* CTA Button */}
      <Button onClick={onNext} className="mb-4 w-full h-12">
        Let&apos;s Get Started
      </Button>

      <p className="text-xs text-muted-foreground">
        This will only take 2 minutes
      </p>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl text-left">
    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);
