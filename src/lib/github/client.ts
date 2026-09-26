import { GitHubRepo, GitHubActivityData, ContributionDay } from "@/types";

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
        next: { revalidate: 60 }, // Revalidate every 60s for near real-time updates
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

export async function fetchGitHubActivity(
  username: string,
  options?: { forceFresh?: boolean }
): Promise<GitHubActivityData | null> {
  try {
    const timestamp = Date.now();
    const url = options?.forceFresh
      ? `https://github-contributions-api.jogruber.de/v4/${username}?y=last&_t=${timestamp}`
      : `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;

    const res = await fetch(url, {
      ...(options?.forceFresh
        ? { cache: "no-store" as RequestCache }
        : { next: { revalidate: 60 } }),
    });

    if (!res.ok) {
      console.warn(`GitHub contributions API request failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const contributions: ContributionDay[] = data.contributions || [];
    const totalContributions =
      typeof data.total?.lastYear === "number"
        ? data.total.lastYear
        : contributions.reduce((acc: number, d: ContributionDay) => acc + (d.count || 0), 0);

    let activeDays = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const d of contributions) {
      if (d.count > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    let currentStreak = 0;
    for (let i = contributions.length - 1; i >= 0; i--) {
      const d = contributions[i];
      if (d.count > 0) {
        currentStreak++;
      } else if (i === contributions.length - 1) {
        // If today has 0 commits yet, don't break streak if yesterday had commits
        continue;
      } else {
        break;
      }
    }

    return {
      totalContributions,
      activeDays,
      currentStreak,
      longestStreak,
      contributions,
    };
  } catch (error) {
    console.error("Error fetching GitHub activity:", error);
    return null;
  }
}

