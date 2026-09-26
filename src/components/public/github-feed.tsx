import { GitHubRepo } from "@/types";
import { GitFork, Star, Terminal, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export function GitHubFeed({ repos }: { repos: GitHubRepo[] }) {
  if (!repos || repos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-8 text-center">
        <GithubIcon className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
        <p className="font-mono text-xs text-muted-foreground">
          GitHub telemetry offline or cached. Connect GITHUB_TOKEN to sync live open-source commits.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 transition-all hover:border-primary/40 hover:bg-card"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {repo.name}
                </span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {repo.description || "Active open-source repository and experiments."}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] font-mono text-muted-foreground">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/70" />
                <span>{repo.language}</span>
              </span>
            )}

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>{repo.stargazers_count}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                <span>{repo.forks_count}</span>
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
