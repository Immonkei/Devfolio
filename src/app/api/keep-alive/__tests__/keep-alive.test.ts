import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase server client before importing route and actions
const mockSelect = vi.fn().mockReturnThis();
const mockLimit = vi.fn().mockReturnThis();
const mockOrder = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "profile-1" }, error: null });
const mockInsert = vi.fn().mockResolvedValue({ error: null });

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: mockSelect.mockReturnValue({
      limit: mockLimit.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      }),
      eq: mockEq.mockReturnValue({
        order: mockOrder.mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: "event-1",
                created_at: new Date().toISOString(),
                metadata: { latency_ms: 25, source: "test_source" },
                event_type: "supabase_keep_alive_heartbeat",
              },
            ],
            error: null,
          }),
        }),
      }),
    }),
    insert: mockInsert,
  })),
};

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(() => mockSupabaseClient),
  createPublicClient: vi.fn(() => mockSupabaseClient),
  createClient: vi.fn(async () => mockSupabaseClient),
}));

import { GET, POST } from "../route";
import { triggerKeepAlive, getKeepAliveStatus } from "@/actions/keep-alive";

describe("Supabase Keep-Alive API & Action", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("handles GET request to /api/keep-alive successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/keep-alive");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("latencyMs");
    expect(data).toHaveProperty("message");
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("handles POST request to /api/keep-alive successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/keep-alive", {
      method: "POST",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("respects CRON_SECRET authorization when configured", async () => {
    process.env.CRON_SECRET = "test-secret-token";

    // Request without auth header should fail
    const unauthReq = new NextRequest("http://localhost:3000/api/keep-alive");
    const unauthRes = await GET(unauthReq);
    expect(unauthRes.status).toBe(401);

    // Request with valid Bearer token should succeed
    const authReq = new NextRequest("http://localhost:3000/api/keep-alive", {
      headers: {
        authorization: "Bearer test-secret-token",
      },
    });
    const authRes = await GET(authReq);
    expect(authRes.status).toBe(200);

    // Request with x-vercel-cron header should succeed
    const vercelReq = new NextRequest("http://localhost:3000/api/keep-alive", {
      headers: {
        "x-vercel-cron": "1",
      },
    });
    const vercelRes = await GET(vercelReq);
    expect(vercelRes.status).toBe(200);
  });

  it("executes triggerKeepAlive server action and returns structured result", async () => {
    const result = await triggerKeepAlive("unit_test");
    expect(result.success).toBe(true);
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("latencyMs");
    expect(result.source).toBe("unit_test");
  });

  it("retrieves keep-alive health status and suspension countdown", async () => {
    const status = await getKeepAliveStatus();
    expect(status.isHealthy).toBe(true);
    expect(status.daysUntilSuspension).toBeGreaterThan(0);
    expect(status).toHaveProperty("configuredUrl");
    expect(Array.isArray(status.recentLogs)).toBe(true);
    expect(status.recentLogs.length).toBeGreaterThan(0);
  });
});
