"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/10 p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mb-2 font-mono text-lg font-semibold tracking-tight text-foreground">
          System Exception Encountered
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred during execution."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Execution
        </button>
      </div>
    </div>
  );
}
