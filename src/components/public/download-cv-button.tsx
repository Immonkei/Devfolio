"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Download, Sparkles, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export interface DownloadCvButtonProps {
  className?: string;
  size?: "default" | "sm";
  variant?: "outline" | "secondary";
}

export function DownloadCvButton({
  className,
  size = "default",
  variant = "outline",
}: DownloadCvButtonProps) {
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Trigger visual state change on the button
    setIsComingSoon(true);
    setShowToast(true);

    // Clear existing timers if re-clicked
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    // Revert button text after 3.5 seconds
    resetTimerRef.current = setTimeout(() => {
      setIsComingSoon(false);
    }, 3500);

    // Auto-dismiss toast after 5 seconds
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const toastContent =
    mounted && showToast ? (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-primary/40 bg-card/95 p-4 text-card-foreground shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-mono text-xs font-bold text-foreground">
                  CV Coming Soon
                </h4>
                <span className="rounded-full border border-primary/40 bg-primary/15 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-primary">
                  In Progress
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                My updated CV is currently being refreshed with recent engineering projects and will be available for download soon.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-primary hover:underline"
                  onClick={() => setShowToast(false)}
                >
                  <span>Get in touch instead</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={isComingSoon ? "CV Coming Soon" : "Download CV"}
        aria-label={isComingSoon ? "CV Coming Soon" : "Download CV"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border font-mono font-medium transition-all duration-200 cursor-pointer select-none",
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-xs",
          isComingSoon
            ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            : variant === "outline"
            ? "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary hover:text-foreground"
            : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          className
        )}
      >
        {isComingSoon ? (
          <>
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-primary font-semibold">Coming Soon</span>
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" />
            <span>Download CV</span>
          </>
        )}
      </button>

      {mounted && typeof document !== "undefined" && createPortal(toastContent, document.body)}
    </>
  );
}
