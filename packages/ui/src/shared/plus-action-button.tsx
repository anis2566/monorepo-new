import { LucideIcon, PlusCircle } from "lucide-react";

import { Button } from "../components/button";

interface PlusActionButtonProps {
  onClickAction: () => void;
  disabled?: boolean;
  actionButtonText: string;
  actionButtonVariant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  Icon?: LucideIcon;
}

export const PlusActionButton = ({
  onClickAction,
  actionButtonText,
  actionButtonVariant,
  Icon,
  disabled = false,
}: PlusActionButtonProps) => {
  return (
    <Button
      className="rounded-full"
      onClick={onClickAction}
      variant={actionButtonVariant}
      disabled={disabled}
    >
      {Icon ? <Icon className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
      <span onClick={onClickAction}>{actionButtonText}</span>
    </Button>
  );
};
