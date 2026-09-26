import { Badge } from "@/components/ui/badge";
import { Technology } from "@/types";

export function TechBadge({ tech }: { tech: Technology }) {
  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center gap-1.5 border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs font-mono text-foreground hover:border-primary/50 transition-colors"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span>{tech.name}</span>
    </Badge>
  );
}
