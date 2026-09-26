"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard exception:", error);
  }, [error]);

  return (
    <div className="flex h-96 w-full flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="font-mono text-sm font-semibold text-foreground">
          Administrative Action Failed
        </h3>
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          {error.message || "Database query or server action threw an exception."}
        </p>
        <button
          onClick={reset}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-mono text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          Retry Request
        </button>
      </div>
    </div>
  );
}
