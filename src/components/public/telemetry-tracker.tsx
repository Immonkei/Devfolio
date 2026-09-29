"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function TelemetryTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "test") return;
    if (pathname && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
