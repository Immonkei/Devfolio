"use client";

import { useMemo, useState } from "react";
import { GitHubActivityData, ContributionDay } from "@/types";
import { GitCommit, Flame, Trophy, Calendar, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface GitHubActivityGraphProps {
  activity: GitHubActivityData | null;
  username: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-secondary/40 border-border/40 hover:border-muted-foreground/40",
  1: "bg-sky-950 border-sky-800/70 hover:border-sky-600 hover:bg-sky-900",
  2: "bg-sky-700/80 border-sky-600/80 hover:border-sky-500 hover:bg-sky-700",
  3: "bg-sky-500 border-sky-400 hover:border-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.45)]",
  4: "bg-cyan-300 border-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.85)] hover:bg-cyan-200",
};

export function GitHubActivityGraph({ activity, username }: GitHubActivityGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    if (!activity || !activity.contributions || activity.contributions.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    const contributions = activity.contributions;
    const computedWeeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // First day offset (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDate = new Date(contributions[0].date);
    const startDay = firstDate.getDay();

    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    for (const day of contributions) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        computedWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      computedWeeks.push(currentWeek);
    }

    // Determine month label positions based on the first occurrence of each month
    const labels: { name: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    computedWeeks.forEach((week, weekIndex) => {
      // Find the first valid day in this week
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const month = new Date(firstValidDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ name: MONTH_NAMES[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return { weeks: computedWeeks, monthLabels: labels };
  }, [activity]);

  if (!activity) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center">
        <GithubIcon className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
        <p className="font-mono text-xs text-muted-foreground">
          Live GitHub activity stream currently offline. Check back soon.
        </p>
      </div>
    );
  }

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8 space-y-6">
      {/* Top Header & Stat Badges */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <GithubIcon className="h-4 w-4" />
            <span>GitHub Contribution Heatmap</span>
          </div>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-foreground">
            Year-Round Commit Telemetry
          </h3>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all w-fit"
        >
          <span>@{username}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* 4 Stat Highlights */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
            <GitCommit className="h-3.5 w-3.5 text-primary" />
            <span>Total Commits</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            {activity.totalContributions}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">In the last 365 days</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span>Active Days</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            {activity.activeDays}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">Days with activity</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Current Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            {activity.currentStreak} {activity.currentStreak === 1 ? "day" : "days"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">Active streak</div>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
            <Trophy className="h-3.5 w-3.5 text-yellow-400" />
            <span>Longest Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            {activity.longestStreak} {activity.longestStreak === 1 ? "day" : "days"}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">Max streak record</div>
        </div>
      </div>

      {/* Calendar Grid Container (scrollable on mobile) */}
      <div className="relative rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5 overflow-hidden">
        {/* Hover info banner */}
        <div className="min-h-[24px] mb-3 text-xs font-mono text-muted-foreground flex items-center justify-between">
          <div>
            {hoveredDay ? (
              <span className="text-foreground">
                <span className="font-semibold text-primary">{hoveredDay.count}</span>{" "}
                {hoveredDay.count === 1 ? "contribution" : "contributions"} on{" "}
                <span className="text-foreground font-medium">{formatDisplayDate(hoveredDay.date)}</span>
              </span>
            ) : (
              <span>Hover over any tile to inspect daily contribution metrics</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-block min-w-[720px]">
            {/* Months row */}
            <div className="flex text-[10px] font-mono text-muted-foreground mb-1.5 pl-7">
              {weeks.map((_, index) => {
                const label = monthLabels.find((m) => m.weekIndex === index);
                return (
                  <div key={index} className="w-3 mr-1 text-center shrink-0">
                    {label ? <span className="whitespace-nowrap">{label.name}</span> : null}
                  </div>
                );
              })}
            </div>

            {/* Grid with Day of Week indicators */}
            <div className="flex">
              {/* Day of Week Labels */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-muted-foreground pr-2 py-0.5 select-none h-[96px]">
                <span className="h-3 leading-3">Sun</span>
                <span className="h-3 leading-3">Tue</span>
                <span className="h-3 leading-3">Thu</span>
                <span className="h-3 leading-3">Sat</span>
              </div>

              {/* Weeks columns */}
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                      if (!day) {
                        return <div key={dayIdx} className="h-3 w-3 rounded-xs opacity-0" />;
                      }

                      return (
                        <div
                          key={day.date}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={cn(
                            "h-3 w-3 rounded-xs border transition-all duration-150 cursor-pointer",
                            LEVEL_CLASSES[day.level] || LEVEL_CLASSES[0],
                            hoveredDay?.date === day.date && "ring-2 ring-primary ring-offset-1 ring-offset-background scale-125 z-10"
                          )}
                          title={`${day.count} contributions on ${day.date}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Live telemetry synced from GitHub</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className={cn("h-2.5 w-2.5 rounded-xs border", LEVEL_CLASSES[0])} />
            <div className={cn("h-2.5 w-2.5 rounded-xs border", LEVEL_CLASSES[1])} />
            <div className={cn("h-2.5 w-2.5 rounded-xs border", LEVEL_CLASSES[2])} />
            <div className={cn("h-2.5 w-2.5 rounded-xs border", LEVEL_CLASSES[3])} />
            <div className={cn("h-2.5 w-2.5 rounded-xs border", LEVEL_CLASSES[4])} />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
