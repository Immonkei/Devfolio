import { createPublicClient } from "@/lib/supabase/server";
import { ExperienceCard } from "@/components/public/experience-card";
import { Briefcase, GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Experience, Education } from "@/types";

export const metadata = {
  title: "Experience & Track Record",
  description: "Professional experience, internships, and academic background in software engineering.",
};

export const revalidate = 60;

export default async function ExperiencePage() {
  let experiences: Experience[] = [];
  let education: Education[] = [];

  try {
    const supabase = createPublicClient();
    const [{ data: expData }, { data: eduData }] = await Promise.all([
      supabase.from("experiences").select("*").order("display_order", { ascending: true }),
      supabase.from("education").select("*").order("display_order", { ascending: true }),
    ]);

    if (expData) experiences = expData;
    if (eduData) education = eduData;
  } catch (err) {
    console.error("Experience query error:", err);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <Briefcase className="h-4 w-4" />
          <span>Professional History</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Work Experience & Roles
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Professional roles, internships, and hands-on engineering work building web applications and backend systems.
        </p>
      </div>

      {/* Experience Timeline */}
      <section className="space-y-8">
        {experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs font-mono text-muted-foreground">
            No experience records found in database.
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>

      {/* Education & Qualifications */}
      {education.length > 0 && (
        <section className="space-y-6 border-t border-border pt-12">
          <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Qualifications</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="rounded-xl border border-border bg-card/60 p-6 space-y-2"
              >
                <div className="font-mono text-xs text-muted-foreground">
                  {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                </div>
                <h3 className="font-bold text-base text-foreground">
                  {edu.degree}
                </h3>
                <div className="font-mono text-xs text-primary font-medium">
                  {edu.institution}
                </div>
                {edu.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
