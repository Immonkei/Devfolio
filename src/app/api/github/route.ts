import { NextResponse } from "next/server";
import { fetchGitHubRepositories } from "@/lib/github/client";

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Immonkei";
  const repos = await fetchGitHubRepositories(username);
  return NextResponse.json({ repositories: repos });
}
