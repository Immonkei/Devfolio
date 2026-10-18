import { createPublicClient } from "@/lib/supabase/server";
import Image from "next/image";
import { GraduationCap, Compass, Terminal, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DownloadCvButton } from "@/components/public/download-cv-button";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Education, Profile } from "@/types";

export const metadata = {
  title: "About",
  description: "Engineering background, technical principles, and education.",
};

export default async function AboutPage() {
  let profile: Profile | null = null;
  let education: Education[] = [];

  try {
    const supabase = createPublicClient();
    const [{ data: profileData }, { data: educationData }] = await Promise.all([
      supabase.from("profiles").select("*").limit(1).single(),
      supabase.from("education").select("*").order("display_order", { ascending: true }),
    ]);

    profile = profileData;
    if (educationData) education = educationData;
  } catch (err) {
    console.error("About page query error:", err);
  }

  const name = profile?.name || "Min Phanith";
  const bio =
    profile?.bio ||
    "I am a dedicated IT Engineering student at the Royal University of Phnom Penh (RUPP) with hands-on experience as a junior developer. My practice centers on building clean REST APIs, structured database schemas, reliable authentication flows, and seamless frontend integrations.";

  const principles = [
    {
      title: "Write Clean, Readable Code",
      description:
        "Prioritize clarity over cleverness. Well-named variables, consistent patterns, and clear function boundaries make codebases maintainable and collaborative.",
    },
    {
      title: "Learn by Building",
      description:
        "The best way to understand a technology is to ship something with it. Side projects and real-world applications teach lessons that tutorials alone cannot.",
    },
    {
      title: "Test What Matters",
      description:
        "Write tests for critical paths and edge cases. Automated testing catches regressions early and builds confidence when refactoring or adding new features.",
    },
    {
      title: "Stay Curious, Stay Humble",
      description:
        "Technology evolves fast. Embrace new tools and frameworks, ask questions, seek code reviews, and treat every bug as a learning opportunity.",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-16">
      {/* Intro */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
            <Terminal className="h-4 w-4" />
            <span>About Engineering Identity</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {name}
          </h1>
          <p className="font-mono text-base text-primary">
            {profile?.headline || "Junior Full-Stack Developer"}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed pt-2">
            {bio}
          </p>
        </div>

        {/* Avatar Portrait Card */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-primary/20 via-cyan-400/10 to-blue-600/20 blur-xl opacity-75 pointer-events-none" />
          <div className="relative rounded-2xl border border-border/80 bg-card/80 p-2 shadow-xl">
            <Image
              src={profile?.avatar_url || "/avatar.png"}
              alt={name}
              width={220}
              height={220}
              preload={true}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.25)]"
            />
          </div>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <Compass className="h-4 w-4" />
          <span>Core Engineering Principles</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card/60 p-5 space-y-2"
            >
              <div className="font-mono text-xs text-primary">0{idx + 1}.</div>
              <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <GraduationCap className="h-4 w-4" />
          <span>Academic Background & Credentials</span>
        </div>

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
            <div className="space-y-4">
              {activeEducation.map((item) => {
                const isRupp =
                  item.institution.toLowerCase().includes("rupp") ||
                  item.institution.toLowerCase().includes("royal university of phnom penh");

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/80 bg-card/60 p-6 space-y-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-foreground text-base">
                            {item.degree}
                          </h3>
                          {isRupp && (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary font-semibold">
                              ITE Program 7
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-primary">
                          {item.institution}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground sm:text-right shrink-0">
                        {formatDate(item.start_date)} — {item.end_date ? formatDate(item.end_date) : "Present (Expected 2027)"}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
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
          );
        })()}
      </section>

      {/* CTA */}
      <section className="pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            Looking for a motivated developer for your team or project?
          </span>
          <div className="flex items-center gap-3">
            <DownloadCvButton size="sm" />
            <Link href="/contact">
              <Button size="sm" className="font-mono text-xs gap-1.5">
                <span>Get in touch</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
