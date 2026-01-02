import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "peer w-full rounded-lg border border-border bg-secondary/50 px-4 pb-2 pt-6 text-base text-foreground placeholder-transparent transition-all duration-200",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "hover:border-muted-foreground/30",
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          ref={ref}
          placeholder={label}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          {...props}
        />
        <label
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200",
            "peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs",
            error && "peer-focus:text-destructive"
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export { AuthInput };
