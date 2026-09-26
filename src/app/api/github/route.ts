import { NextResponse } from "next/server";
import { fetchGitHubRepositories, fetchGitHubActivity } from "@/lib/github/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Immonkei";
  const [repositories, activity] = await Promise.all([
    fetchGitHubRepositories(username),
    fetchGitHubActivity(username, { forceFresh: true }),
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
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
