"use server";

import { createAdminClient, createPublicClient } from "@/lib/supabase/server";

export interface KeepAlivePingResult {
  success: boolean;
  timestamp: string;
  latencyMs: number;
  source: string;
  writeRecorded: boolean;
  message: string;
  error?: string;
}

export interface KeepAliveAuditItem {
  id: string;
  timestamp: string;
  latencyMs: number;
  source: string;
  eventType: string;
}

export interface KeepAliveStatus {
  isHealthy: boolean;
  lastPingTimestamp: string | null;
  lastLatencyMs: number | null;
  daysUntilSuspension: number;
  recentLogs: KeepAliveAuditItem[];
  configuredUrl: string;
}

function getSafeClient() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/**
 * Executes a heartbeat ping against Supabase.
 * Performs both a read and a state write transaction to guarantee
 * Supabase activity metrics register active usage and reset the 7-day inactivity pause counter.
 */
export async function triggerKeepAlive(source: string = "manual"): Promise<KeepAlivePingResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  let client = getSafeClient();
  if (!client) {
    client = createPublicClient();
  }

  try {
    // 1. Read query to test database read responsiveness
    const { error: readError } = await client
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (readError) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        timestamp,
        latencyMs,
        source,
        writeRecorded: false,
        message: "Supabase read query failed.",
        error: readError.message,
      };
    }

    const latencyMs = Date.now() - startTime;
    let writeRecorded = false;

    // 2. Write transaction into events table to guarantee transactional activity
    try {
      const { error: writeError } = await client.from("events").insert({
        event_type: "supabase_keep_alive_heartbeat",
        page: "/api/keep-alive",
        metadata: {
          source,
          latency_ms: latencyMs,
          timestamp,
        },
      });

      if (!writeError) {
        writeRecorded = true;
      }
    } catch {
      // Non-fatal if events table has schema constraints; read query already reset activity
      writeRecorded = false;
    }

    return {
      success: true,
      timestamp,
      latencyMs,
      source,
      writeRecorded,
      message: "Supabase heartbeat verified successfully. Inactivity timer reset.",
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : "Unknown keep-alive exception";
    return {
      success: false,
      timestamp,
      latencyMs,
      source,
      writeRecorded: false,
      message: "Failed to connect to Supabase database.",
      error: errorMsg,
    };
  }
}

/**
 * Retrieves the current health status, last heartbeat timestamp,
 * and recent audit logs for the keep-alive monitor.
 */
export async function getKeepAliveStatus(): Promise<KeepAliveStatus> {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-devfolio.supabase.co";

  let client = getSafeClient();
  if (!client) {
    client = createPublicClient();
  }

  try {
    const { data, error } = await client
      .from("events")
      .select("id, created_at, metadata, event_type")
      .eq("event_type", "supabase_keep_alive_heartbeat")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      // If no events recorded yet, perform a quick read to verify database health
      const { error: pingError } = await client
        .from("profiles")
        .select("id")
        .limit(1)
        .maybeSingle();

      const isHealthy = !pingError;
      return {
        isHealthy,
        lastPingTimestamp: null,
        lastLatencyMs: null,
        daysUntilSuspension: isHealthy ? 7.0 : 0,
        recentLogs: [],
        configuredUrl,
      };
    }

    const recentLogs: KeepAliveAuditItem[] = data.map((item) => {
      const meta = (item.metadata as Record<string, unknown>) || {};
      return {
        id: item.id,
        timestamp: item.created_at,
        latencyMs: typeof meta.latency_ms === "number" ? meta.latency_ms : 0,
        source: typeof meta.source === "string" ? meta.source : "scheduler",
        eventType: item.event_type,
      };
    });

    const mostRecent = recentLogs[0];
    const lastPingDate = new Date(mostRecent.timestamp);
    const now = new Date();
    const hoursElapsed = Math.max(0, (now.getTime() - lastPingDate.getTime()) / (1000 * 60 * 60));
    // Supabase pauses after 7 days (168 hours) of no traffic
    const daysUntilSuspension = Math.max(0, Number(((168 - hoursElapsed) / 24).toFixed(1)));

    return {
      isHealthy: true,
      lastPingTimestamp: mostRecent.timestamp,
      lastLatencyMs: mostRecent.latencyMs,
      daysUntilSuspension,
      recentLogs,
      configuredUrl,
    };
  } catch {
    return {
      isHealthy: false,
      lastPingTimestamp: null,
      lastLatencyMs: null,
      daysUntilSuspension: 0,
      recentLogs: [],
      configuredUrl,
    };
  }
}
