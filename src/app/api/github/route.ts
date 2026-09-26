import { NextResponse } from "next/server";
import { fetchGitHubRepositories, fetchGitHubActivity } from "@/lib/github/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Immonkei";
  const [repositories, activity] = await Promise.all([
    fetchGitHubRepositories(username),
    fetchGitHubActivity(username),
  ]);

  return NextResponse.json({
    username,
    repositories,
    activity,
    updatedAt: new Date().toISOString(),
  });
}
