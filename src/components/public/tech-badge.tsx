/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { Technology } from "@/types";
import { getTechIconUrl } from "@/lib/tech-icons";

export function TechBadge({ tech }: { tech: Technology }) {
  const iconUrl = getTechIconUrl(tech.icon, tech.name);
  const normalizedKey = (tech.icon || tech.name).toLowerCase();
  const isMonochrome = ["nextjs", "next.js", "express", "express.js", "github"].includes(
    normalizedKey
  );

  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-mono text-foreground hover:border-primary/50 hover:bg-secondary/70 hover:shadow-xs transition-all cursor-default"
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 object-contain ${
            isMonochrome ? "dark:brightness-0 dark:invert" : ""
          }`}
          loading="lazy"
        />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      )}
      <span>{tech.name}</span>
    </Badge>
  );
}
