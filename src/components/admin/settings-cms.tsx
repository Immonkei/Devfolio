"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/settings";
import { Profile } from "@/types";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsCMS({ initialProfile }: { initialProfile: Profile | null }) {
  const [form, setForm] = useState({
    name: initialProfile?.name || "Senior Systems Engineer",
    headline: initialProfile?.headline || "Staff Software Engineer",
    bio: initialProfile?.bio || "",
    location: initialProfile?.location || "San Francisco, CA & Remote",
    avatar_url: initialProfile?.avatar_url || "",
    resume_url: initialProfile?.resume_url || "",
    github_url: initialProfile?.github_url || "",
    linkedin_url: initialProfile?.linkedin_url || "",
    twitter_url: initialProfile?.twitter_url || "",
    role: initialProfile?.role || "Senior Software Engineer",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialProfile) return;

    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      const res = await updateProfile(initialProfile.id, form);
      if (!res.success) {
        setError(res.error || "Update failed.");
      } else {
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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
          Profile & System Settings
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Manage public engineer bio, avatar URL, resume PDF coordinate, and social handles.
        </p>
      </div>

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
          <Button type="submit" disabled={loading} className="gap-2 font-mono text-xs">
            <Save className="h-3.5 w-3.5" />
            <span>{loading ? "Persisting..." : "Save Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
