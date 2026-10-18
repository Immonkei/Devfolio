import { ContactForm } from "@/components/public/contact-form";
import { Mail, MapPin, Clock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { createPublicClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Contact",
  description: "Get in touch for projects, questions, or opportunities.",
};

export default async function ContactPage() {
  let profile = null;

  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("profiles").select("*").limit(1).single();
    profile = data;
  } catch (err) {
    console.error("Contact page query error:", err);
  }

  const location = profile?.location || "Phnom Penh, Cambodia";
  const github = profile?.github_url || "https://github.com/Immonkei";
  const linkedin = profile?.linkedin_url || "https://www.linkedin.com/in/min-phanith-5a57ba33b/";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <Mail className="h-4 w-4" />
          <span>Contact</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Have a question, project idea, or opportunity? Send a message and I&apos;ll get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Information */}
        <div className="space-y-4 md:col-span-5">
          <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
            <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              Information
            </h3>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Replies within 24 hours</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center gap-2">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
