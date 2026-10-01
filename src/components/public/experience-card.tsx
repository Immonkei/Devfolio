import { formatDate } from "@/lib/utils";
import { Experience } from "@/types";
import { Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COMPANY_LINKS: Record<string, string> = {
  allweb: "https://www.linkedin.com/company/allwebcoltd/posts/",
};

export function ExperienceCard({ experience }: { experience: Experience }) {
  const companyKey = Object.keys(COMPANY_LINKS).find((key) =>
    experience.company.toLowerCase().includes(key.toLowerCase())
  );
  const companyUrl = companyKey ? COMPANY_LINKS[companyKey] : null;

  return (
    <div className="relative pl-6 sm:pl-8 border-l border-border/80 group">
      {/* Timeline Node */}
      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background group-hover:scale-125 transition-transform" />

      <div className="rounded-xl border border-border bg-card/60 p-6 transition-all group-hover:border-primary/40 group-hover:bg-card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {experience.role}
            </h3>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 font-mono text-sm text-primary font-medium hover:underline hover:opacity-85 transition-opacity"
                title={`View ${experience.company} on LinkedIn`}
              >
                <span>{experience.company}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover/link:opacity-100 transition-opacity" />
              </a>
            ) : (
              <div className="font-mono text-sm text-primary font-medium">
                {experience.company}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDate(experience.start_date)} — {formatDate(experience.end_date)}
              </span>
            </span>
            {experience.is_current && (
              <Badge variant="success" className="text-[10px] uppercase font-mono">
                Current
              </Badge>
            )}
          </div>
        </div>

        {/* Overview Description */}
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>

        {/* Responsibilities list */}
        {experience.responsibilities && experience.responsibilities.length > 0 && (
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            {experience.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
