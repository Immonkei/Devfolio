import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepositories, fetchGitHubActivity } from "@/lib/github/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const isFresh = request.nextUrl.searchParams.get("fresh") === "true";
  const username = process.env.GITHUB_USERNAME || "Immonkei";
  const [repositories, activity] = await Promise.all([
    fetchGitHubRepositories(username),
    fetchGitHubActivity(username, { forceFresh: isFresh }),
  ]);

  return NextResponse.json(
    {
      username,
      repositories,
      activity,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": isFresh
          ? "no-store, no-cache, must-revalidate"
          : "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
