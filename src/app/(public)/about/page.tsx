import { createPublicClient } from "@/lib/supabase/server";
import { GraduationCap, Compass, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
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
      title: "Complexity is the Enemy of Reliability",
      description:
        "Every added layer of abstraction, microservice, or dependency introduces operational overhead and failure surfaces. Build with the simplest architecture that solves the concrete problem.",
    },
    {
      title: "Content as Data, Not Code",
      description:
        "Engineered systems separate schema and presentation from mutable business data. Changes should flow through verified relational models with RLS guarantees rather than requiring codebase commits.",
    },
    {
      title: "Measure Before Optimizing",
      description:
        "Avoid premature caching or over-engineered infrastructure before empirical bottlenecks have been measured under realistic load with structured telemetry.",
    },
    {
      title: "Zero-Trust Authorization by Default",
      description:
        "Never rely on UI hiding as security. Enforce authorization server-side and directly inside the database through Row Level Security.",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-16">
      {/* Intro */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <Terminal className="h-4 w-4" />
          <span>About Engineering Identity</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {name}
        </h1>
        <p className="font-mono text-base text-primary">
          {profile?.headline || "Staff Software Engineer"}
        </p>
        <p className="text-base text-muted-foreground leading-relaxed pt-2">
          {bio}
        </p>
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

        {education.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/40 p-6 text-sm text-muted-foreground">
            B.S. in Computer Science — Focus on Distributed Systems and Relational Databases.
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card/60 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    {item.degree}
                  </h3>
                  <div className="font-mono text-xs text-primary">
                    {item.institution}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.start_date)} — {formatDate(item.end_date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            Looking for architectural consultation or lead engineering roles?
          </span>
          <Link href="/contact">
            <Button size="sm" className="font-mono text-xs gap-1.5">
              <span>Get in touch</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
