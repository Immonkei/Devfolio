"use client";

import { useState } from "react";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/actions/experience";
import { Experience } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export function ExperienceCMS({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    responsibilitiesText: "",
    start_date: "",
    end_date: "",
    is_current: false,
    display_order: 0,
  });

  const resetForm = () => {
    setForm({
      company: "",
      role: "",
      description: "",
      responsibilitiesText: "",
      start_date: "",
      end_date: "",
      is_current: false,
      display_order: 0,
    });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      role: exp.role,
      description: exp.description,
      responsibilitiesText: (exp.responsibilities || []).join("\n"),
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      display_order: exp.display_order,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this career experience?")) return;
    const res = await deleteExperience(id);
    if (res.success) {
      setExperiences(experiences.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const responsibilities = form.responsibilitiesText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      company: form.company,
      role: form.role,
      description: form.description,
      responsibilities,
      start_date: form.start_date,
      end_date: form.is_current ? null : form.end_date || null,
      is_current: form.is_current,
      display_order: Number(form.display_order) || 0,
    };

    try {
      if (editingId) {
        const res = await updateExperience(editingId, payload);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else if (res.data) {
          setExperiences(
            experiences.map((e) => (e.id === editingId ? res.data : e))
          );
          resetForm();
        }
      } else {
        const res = await createExperience(payload);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          setExperiences([res.data, ...experiences]);
          resetForm();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Experience CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage roles, company milestones, and technical responsibilities.
          </p>
        </div>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="gap-1.5 font-mono text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Experience</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground">
              {editingId ? "Update Experience" : "Record New Career Position"}
            </h2>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Company *</label>
                <Input
                  required
                  placeholder="Apex Cloud"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Role *</label>
                <Input
                  required
                  placeholder="Senior Software Engineer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Summary *</label>
              <Textarea
                required
                rows={2}
                placeholder="High-level engineering domain, mission, and team scope"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">
                Key Responsibilities & Accomplishments (One per line)
              </label>
              <Textarea
                rows={4}
                placeholder="Architected distributed ingestion queue&#10;Decreased DB query latency by 45%&#10;Mentored 6 engineers"
                value={form.responsibilitiesText}
                onChange={(e) =>
                  setForm({ ...form, responsibilitiesText: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Start Date * (YYYY-MM-DD)</label>
                <Input
                  required
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">End Date (YYYY-MM-DD)</label>
                <Input
                  type="date"
                  disabled={form.is_current}
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Display Order</label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? "" : form.end_date,
                    })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Current Position</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? "Persisting..." : editingId ? "Save Changes" : "Create Record"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Experience Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="border-b border-border bg-secondary/50 text-muted-foreground text-left">
              <tr>
                <th className="p-4">Company</th>
                <th className="p-4">Role</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Current</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No experience records found.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{exp.company}</td>
                    <td className="p-4 text-primary font-medium">{exp.role}</td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                    </td>
                    <td className="p-4">
                      {exp.is_current ? (
                        <span className="text-emerald-400 font-bold">CURRENT</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
