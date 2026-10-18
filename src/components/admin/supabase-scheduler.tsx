"use client";

import { useState, useEffect, useCallback } from "react";
import {
  triggerKeepAlive,
  KeepAliveStatus,
  KeepAlivePingResult,
} from "@/actions/keep-alive";
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  Copy,
  Check,
  Activity,
  Terminal,
  Database,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupabaseSchedulerProps {
  initialStatus: KeepAliveStatus;
}

export function SupabaseScheduler({ initialStatus }: SupabaseSchedulerProps) {
  const [status, setStatus] = useState<KeepAliveStatus>(initialStatus);
  const [pinging, setPinging] = useState(false);
  const [lastResult, setLastResult] = useState<KeepAlivePingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // In-browser periodic heartbeat toggle
  const [browserIntervalMinutes, setBrowserIntervalMinutes] = useState<number>(0); // 0 = disabled
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Manual Trigger
  const handleManualPing = async () => {
    setPinging(true);
    setError(null);
    try {
      const res = await triggerKeepAlive("admin_manual_ui");
      setLastResult(res);
      if (res.success) {
        setStatus((prev) => ({
          ...prev,
          isHealthy: true,
          lastPingTimestamp: res.timestamp,
          lastLatencyMs: res.latencyMs,
          daysUntilSuspension: 7.0,
          recentLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: res.timestamp,
              latencyMs: res.latencyMs,
              source: "admin_manual_ui",
              eventType: "supabase_keep_alive_heartbeat",
            },
            ...prev.recentLogs.slice(0, 9),
          ],
        }));
      } else {
        setError(res.error || "Heartbeat failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Heartbeat exception.");
    } finally {
      setPinging(false);
    }
  };

  // In-browser background heartbeat timer
  const runBackgroundPing = useCallback(async () => {
    try {
      const res = await triggerKeepAlive("browser_background_scheduler");
      if (res.success) {
        setStatus((prev) => ({
          ...prev,
          isHealthy: true,
          lastPingTimestamp: res.timestamp,
          lastLatencyMs: res.latencyMs,
          daysUntilSuspension: 7.0,
          recentLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: res.timestamp,
              latencyMs: res.latencyMs,
              source: "browser_background_scheduler",
              eventType: "supabase_keep_alive_heartbeat",
            },
            ...prev.recentLogs.slice(0, 9),
          ],
        }));
      }
    } catch {
      // silent background failure
    }
  }, []);

  useEffect(() => {
    if (browserIntervalMinutes <= 0) return;
    const intervalMs = browserIntervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      runBackgroundPing();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [browserIntervalMinutes, runBackgroundPing]);

  const handleCopyUrl = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
      await navigator.clipboard.writeText(`${origin}/api/keep-alive`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // ignore
    }
  };

  const formatHeartbeatTime = (isoString: string | null) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Unknown";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <h2 className="font-mono text-sm font-bold text-foreground">
                Supabase Anti-Suspension Heartbeat Guard
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Prevents Supabase free-tier 7-day inactivity pause by dispatching automated keep-alive queries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleManualPing}
              disabled={pinging}
              size="sm"
              className="gap-2 font-mono text-xs cursor-pointer shadow-sm"
              title="Execute immediate database heartbeat ping"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${pinging ? "animate-spin" : ""}`} />
              <span>{pinging ? "Pinging Supabase..." : "Send Heartbeat Now"}</span>
            </Button>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Status Guard */}
          <div className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Guard Status</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-mono text-base font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{status.isHealthy ? "Active & Guarded" : "Unreachable"}</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              {status.configuredUrl.replace(/^https?:\/\//, "")}
            </p>
          </div>

          {/* Inactivity Pause Timer */}
          <div className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Inactivity Risk Window</span>
              <Clock className="h-3 w-3 text-primary" />
            </div>
            <div className="font-mono text-base font-bold text-emerald-400">
              {status.daysUntilSuspension} days left
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Resets to 7.0d after every heartbeat
            </p>
          </div>

          {/* Last Ping Timestamp */}
          <div className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Last Heartbeat</span>
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="font-mono text-sm font-bold text-foreground truncate">
              {formatHeartbeatTime(status.lastPingTimestamp)}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              {status.lastPingTimestamp
                ? new Date(status.lastPingTimestamp).toLocaleTimeString()
                : "No heartbeat yet"}
            </p>
          </div>

          {/* Roundtrip Latency */}
          <div className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Database Latency</span>
              <Zap className="h-3 w-3 text-amber-400" />
            </div>
            <div className="font-mono text-base font-bold text-foreground">
              {status.lastLatencyMs !== null ? `${status.lastLatencyMs} ms` : "—"}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Direct roundtrip query time
            </p>
          </div>
        </div>

        {/* Feedback banners */}
        {lastResult && (
          <div
            className={`rounded-lg border p-3 font-mono text-xs flex items-center justify-between ${
              lastResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2">
              {lastResult.success ? (
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span>{lastResult.message}</span>
            </div>
            <span className="text-[11px] opacity-80">{lastResult.latencyMs}ms</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
            {error}
          </div>
        )}

        {/* In-Browser Background Heartbeat Interval Selector */}
        <div className="rounded-lg border border-border/80 bg-secondary/20 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-0.5">
              <label className="text-foreground font-semibold flex items-center gap-1.5 text-xs font-mono">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span>In-Browser Keep-Alive Heartbeat</span>
              </label>
              <p className="text-[11px] text-muted-foreground font-mono">
                Automatically pings Supabase on a background timer whenever you have this admin tab open.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={browserIntervalMinutes}
                onChange={(e) => setBrowserIntervalMinutes(Number(e.target.value))}
                className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={0}>Disabled</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every 1 hour (Recommended)</option>
                <option value={360}>Every 6 hours</option>
              </select>
            </div>
          </div>
          {browserIntervalMinutes > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                Background scheduler active: Next heartbeat scheduled in {browserIntervalMinutes} minutes.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Automated Scheduling Architecture Cards */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-sm font-bold text-foreground">
            Automated Server-Side Keep-Alive Channels
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Three independent automated channels are pre-configured to ensure your Supabase database stays awake even when nobody visits:
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Method 1: Vercel Cron */}
          <div className="rounded-lg border border-border/80 bg-secondary/15 p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">1. Vercel Cron</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                  Pre-configured
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                Configured via <code className="text-primary">vercel.json</code>. Automatically triggers <code className="text-primary">/api/keep-alive</code> every 2 days at 04:00 UTC.
              </p>
            </div>
            <div className="pt-2 border-t border-border/60 text-[10px] font-mono text-muted-foreground">
              Schedule: <code className="text-foreground">0 4 */2 * *</code>
            </div>
          </div>

          {/* Method 2: GitHub Actions */}
          <div className="rounded-lg border border-border/80 bg-secondary/15 p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">2. GitHub Actions</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                  Workflow Ready
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                Configured in <code className="text-primary">.github/workflows/supabase-keepalive.yml</code>. Runs on GitHub cloud runners every 2 days for 100% free uptime redundancy.
              </p>
            </div>
            <div className="pt-2 border-t border-border/60 text-[10px] font-mono text-muted-foreground">
              Schedule: <code className="text-foreground">0 4 */2 * *</code>
            </div>
          </div>

          {/* Method 3: External Webhook */}
          <div className="rounded-lg border border-border/80 bg-secondary/15 p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">3. External Webhook</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                Plug your keep-alive endpoint into free monitoring services like cron-job.org, Upstash, or UptimeRobot.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="mt-2 flex items-center justify-between w-full rounded border border-border bg-card px-2 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Copy keep-alive endpoint URL"
            >
              <span className="truncate max-w-[170px]">/api/keep-alive</span>
              {copiedUrl ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Copied
                </span>
              ) : (
                <Copy className="h-3 w-3 shrink-0 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Heartbeat Audit History */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-mono text-sm font-bold text-foreground">
              Recent Heartbeat Audit History
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            {status.recentLogs.length} logged events
          </span>
        </div>

        {status.recentLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground font-mono">
            No keep-alive heartbeats recorded yet. Click &apos;Send Heartbeat Now&apos; above to initiate your first guard ping.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {status.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2.5 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-medium text-foreground truncate">{log.source}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-muted-foreground text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded bg-secondary/60 px-2 py-0.5 text-[11px] text-foreground">
                    {log.latencyMs} ms
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20 font-medium">
                    SUCCESS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
