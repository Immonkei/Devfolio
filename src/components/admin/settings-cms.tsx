"use client";

import { useState } from "react";
import { upsertProfile } from "@/actions/settings";
import { Profile } from "@/types";
import { KeepAliveStatus } from "@/actions/keep-alive";
import { SupabaseScheduler } from "@/components/admin/supabase-scheduler";
import { Save, Check, User, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsCMS({
  initialProfile,
  initialKeepAliveStatus,
}: {
  initialProfile: Profile | null;
  initialKeepAliveStatus: KeepAliveStatus;
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "scheduler">("profile");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(initialProfile);
  const [form, setForm] = useState({
    name: initialProfile?.name || "Min Phanith",
    headline: initialProfile?.headline || "Junior Full-Stack Developer",
    bio: initialProfile?.bio || "",
    location: initialProfile?.location || "Phnom Penh, Cambodia",
    avatar_url: initialProfile?.avatar_url || "",
    resume_url: initialProfile?.resume_url || "",
    github_url: initialProfile?.github_url || "",
    linkedin_url: initialProfile?.linkedin_url || "",
    twitter_url: initialProfile?.twitter_url || "",
    role: initialProfile?.role || "Junior Full-Stack Developer",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      const res = await upsertProfile(currentProfile?.id, form);
      if (!res.success) {
        setError(res.error || "Update failed.");
      } else {
        if (res.data) {
          setCurrentProfile(res.data);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
          Profile & System Settings
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Manage developer bio, social coordinates, and Supabase anti-suspension heartbeat schedules.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Profile & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("scheduler")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            activeTab === "scheduler"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Supabase Anti-Suspension</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Tab 1: Profile & Identity */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {saved && (
            <div className="flex items-center gap-2 p-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <Check className="h-4 w-4" />
              <span>Profile configuration persisted successfully.</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-sm font-bold text-foreground">Identity & Bio</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Full Name *</label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Role Title *</label>
                  <Input
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Headline *</label>
                <Input
                  required
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Full Engineering Biography</label>
                <Textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-sm font-bold text-foreground">External Handles & Resume</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-foreground font-semibold">GitHub Profile URL</label>
                  <Input
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">LinkedIn Profile URL</label>
                  <Input
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Avatar Image URL</label>
                  <Input
                    value={form.avatar_url}
                    onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-semibold">Resume PDF URL</label>
                  <Input
                    value={form.resume_url}
                    onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2 font-mono text-xs cursor-pointer">
                <Save className="h-3.5 w-3.5" />
                <span>{loading ? "Persisting..." : "Save Settings"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Supabase Anti-Suspension Scheduler */}
      {activeTab === "scheduler" && (
        <SupabaseScheduler initialStatus={initialKeepAliveStatus} />
      )}
    </div>
  );
}
