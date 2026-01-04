import { ShieldAlert, Eye, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

interface ExamWarningModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExamWarningModal({
  open,
  onConfirm,
  onCancel,
}: ExamWarningModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning/20 rounded-full">
              <ShieldAlert className="w-6 h-6 text-warning" />
            </div>
            <AlertDialogTitle className="text-xl">
              Exam Rules & Anti-Cheating
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please read and acknowledge the following rules before starting
                the exam:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                  <LogOut className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive text-sm">
                      Tab Switch / Close Detection
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      If you switch to another tab, minimize the browser, or
                      close this tab, the exam will be automatically submitted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                  <Eye className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-warning text-sm">
                      Stay Focused
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep this exam tab active and visible throughout the
                      entire exam duration.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                By clicking "Start Exam", you agree to these anti-cheating
                measures.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Start Exam</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
