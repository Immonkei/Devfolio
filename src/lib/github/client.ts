import { GitHubRepo } from "@/types";

export async function fetchGitHubRepositories(username: string): Promise<GitHubRepo[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevForge-Portfolio-Platform",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6&type=owner`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      console.warn(`GitHub API request failed with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    interface RawGitHubRepo {
      id: number;
      name: string;
      full_name: string;
      html_url: string;
      description: string | null;
      fork: boolean;
      stargazers_count: number;
      watchers_count: number;
      language: string | null;
      forks_count: number;
      open_issues_count: number;
      pushed_at: string;
      updated_at: string;
      topics?: string[];
    }

    return (data as RawGitHubRepo[]).map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      fork: repo.fork,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      language: repo.language,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      pushed_at: repo.pushed_at,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
    }));
  } catch (error) {
    console.error("Error communicating with GitHub API:", error);
    return [];
  }
}
