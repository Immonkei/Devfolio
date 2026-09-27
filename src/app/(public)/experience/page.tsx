import { createPublicClient } from "@/lib/supabase/server";
import { ExperienceCard } from "@/components/public/experience-card";
import { Briefcase, GraduationCap, ExternalLink } from "lucide-react";
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
      {(() => {
        const fallbackEducation: Education[] = [
          {
            id: "edu-rupp-ite",
            institution: "Faculty of Engineering, Royal University of Phnom Penh (RUPP)",
            degree: "Bachelor of Information Technology Engineering (ITE)",
            description:
              "Accredited 4-year engineering program emphasizing software engineering, computer organization, and practical system development. Core curriculum and practicum include Advanced Programming, Data Structures & Algorithms, Object-Oriented Analysis & Design (OOAD), Web Technologies & Cloud Computing, Database Systems II, Operating Systems, Mobile Application Development, Information Security, and Capstone Final Project.",
            start_date: "2023-10-01",
            end_date: "2027-07-31",
            display_order: 1,
            created_at: "",
            updated_at: "",
          },
        ];

        const activeEducation = education.length > 0 ? education : fallbackEducation;
        const curriculumHighlights = [
          "Object-Oriented Analysis & Design (OOAD)",
          "Data Structures & Algorithms",
          "Web Technologies & Cloud Computing",
          "Database Systems II",
          "Operating Systems",
          "Mobile Application Development",
          "Information Security",
          "Project Practicum",
        ];

        return (
          <section className="space-y-6 border-t border-border pt-12">
            <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              <span>Academic Qualifications</span>
            </div>

            <div className="space-y-4">
              {activeEducation.map((edu) => {
                const isRupp =
                  edu.institution.toLowerCase().includes("rupp") ||
                  edu.institution.toLowerCase().includes("royal university of phnom penh");

                return (
                  <div
                    key={edu.id}
                    className="rounded-xl border border-border bg-card/60 p-6 space-y-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-foreground">
                            {edu.degree}
                          </h3>
                          {isRupp && (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary font-semibold">
                              ITE Program 7
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-primary font-medium">
                          {edu.institution}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(edu.start_date)} — {edu.end_date ? formatDate(edu.end_date) : "Present (Expected 2027)"}
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {edu.description}
                      </p>
                    )}

                    {isRupp && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                          <span className="uppercase tracking-wider text-[10px] text-primary/90 font-semibold">
                            Core Engineering Coursework
                          </span>
                          <a
                            href="https://www.fe.rupp.edu.kh/program/7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline hover:text-primary/80 transition-colors"
                          >
                            <span>FE RUPP Program 7 Syllabus</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {curriculumHighlights.map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md border border-border/70 bg-secondary/50 px-2 py-0.5 text-[10px] font-mono text-foreground/80"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
