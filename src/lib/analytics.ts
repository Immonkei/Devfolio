import { createClient } from "./supabase/client";
import { Json } from "@/types";

export async function trackEvent(
  eventType: string,
  page?: string,
  resourceId?: string,
  metadata?: Json
) {
  try {
    const supabase = createClient();
    await supabase.from("events").insert([
      {
        event_type: eventType,
        page: page || (typeof window !== "undefined" ? window.location.pathname : null),
        resource_id: resourceId || null,
        metadata: metadata || null,
      },
    ]);
  } catch (err) {
    // Non-blocking telemetry failure
    console.debug("Telemetry track failure:", err);
  }
}

export async function trackPageView(pagePath: string) {
  try {
    const supabase = createClient();
    await supabase.from("page_views").insert([
      {
        page: pagePath,
        visitor_hash: null,
      },
    ]);
  } catch (err) {
    console.debug("Page view record failure:", err);
  }
}
