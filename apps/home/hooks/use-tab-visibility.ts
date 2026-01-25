import { useEffect, useRef } from "react";

interface UseTabVisibilityOptions {
  enabled: boolean;
  onVisibilityChange: (isVisible: boolean) => void;
  onBeforeUnload?: () => void;
}

export function useTabVisibility({
  enabled,
  onVisibilityChange,
  onBeforeUnload,
}: UseTabVisibilityOptions) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (hasTriggeredRef.current) return;

      const isVisible = document.visibilityState === "visible";
      if (!isVisible) {
        hasTriggeredRef.current = true;
        onVisibilityChange(false);
      }
    };

    const handleBlur = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      onVisibilityChange(false);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasTriggeredRef.current) return;

      e.preventDefault();
      e.returnValue = "Your exam will be submitted if you leave. Are you sure?";

      if (onBeforeUnload) {
        hasTriggeredRef.current = true;
        onBeforeUnload();
      }

      return e.returnValue;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, onVisibilityChange, onBeforeUnload]);

  const reset = () => {
    hasTriggeredRef.current = false;
  };

  return { reset };
}
