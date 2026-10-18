import { NextRequest, NextResponse } from "next/server";
import { triggerKeepAlive } from "@/actions/keep-alive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Supabase Keep-Alive Anti-Suspension Webhook Endpoint
 *
 * This endpoint is designed to be triggered periodically (e.g. daily or every 2-3 days)
 * by Vercel Cron, GitHub Actions, or external webhook services (cron-job.org)
 * to prevent Supabase's free-tier 7-day inactivity database suspension.
 */
export async function GET(request: NextRequest) {
  return handleKeepAlive(request);
}

export async function POST(request: NextRequest) {
  return handleKeepAlive(request);
}

async function handleKeepAlive(request: NextRequest) {
  // Optional security: If CRON_SECRET is configured, check Authorization header
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Also allow Vercel Cron internal header
    const vercelCronHeader = request.headers.get("x-vercel-cron");
    if (!vercelCronHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing authorization token.",
        },
        { status: 401 }
      );
    }
  }

  // Determine request source
  const userAgent = request.headers.get("user-agent") || "unknown";
  let source = "cron_api";
  if (request.headers.get("x-vercel-cron")) {
    source = "vercel_cron";
  } else if (userAgent.includes("GitHub-Hookshot") || userAgent.includes("curl")) {
    source = "github_actions_or_curl";
  } else if (userAgent.includes("cron-job.org")) {
    source = "cron_job_org";
  }

  const result = await triggerKeepAlive(source);

  const responseStatus = result.success ? 200 : 503;

  return NextResponse.json(
    {
      ...result,
      nextScheduledWindow: "Within 48 to 72 hours",
      policy: "Supabase Free Tier: Suspends after 7 days (168h) of zero activity",
    },
    {
      status: responseStatus,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
