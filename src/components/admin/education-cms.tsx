"use client";

import { useState } from "react";
import {
  createEducation,
  updateEducation,
  deleteEducation,
  syncRuppEducation,
} from "@/actions/education";
import { Education } from "@/types";
import { Plus, Edit2, Trash2, X, RefreshCw, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

const RUPP_ITE_TEMPLATE = {
  institution: "Faculty of Engineering, Royal University of Phnom Penh (RUPP)",
  degree: "Bachelor of Information Technology Engineering (ITE)",
  description:
    "Accredited 4-year engineering program emphasizing software engineering, computer organization, and practical system development. Core curriculum and practicum include Advanced Programming, Data Structures & Algorithms, Object-Oriented Analysis & Design (OOAD), Web Technologies & Cloud Computing, Database Systems II, Operating Systems, Mobile Application Development, Information Security, and Capstone Final Project.",
  start_date: "2023-10-01",
  end_date: "2027-07-31",
  display_order: 1,
};

export function EducationCMS({ initialEducation }: { initialEducation: Education[] }) {
  const [education, setEducation] = useState(initialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    description: "",
    start_date: "",
    end_date: "",
    display_order: 0,
  });

  const resetForm = () => {
    setForm({
      institution: "",
      degree: "",
      description: "",
      start_date: "",
      end_date: "",
      display_order: 0,
    });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleFillRuppTemplate = () => {
    setForm({
      institution: RUPP_ITE_TEMPLATE.institution,
      degree: RUPP_ITE_TEMPLATE.degree,
      description: RUPP_ITE_TEMPLATE.description,
      start_date: RUPP_ITE_TEMPLATE.start_date,
      end_date: RUPP_ITE_TEMPLATE.end_date,
      display_order: 1,
    });
  };

  const handleSyncRupp = async () => {
    setSyncing(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await syncRuppEducation();
      if (!res.success) {
        setError(res.error || "Failed to sync RUPP education data.");
      } else {
        setStatusMessage(res.message || "Synchronized RUPP Program 7 data successfully.");
        window.location.reload();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sync error.");
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      description: edu.description || "",
      start_date: edu.start_date,
      end_date: edu.end_date || "",
      display_order: edu.display_order,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this education record?")) return;
    const res = await deleteEducation(id);
    if (res.success) {
      setEducation(education.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      institution: form.institution,
      degree: form.degree,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date || null,
      display_order: Number(form.display_order) || 0,
    };

    try {
      if (editingId) {
        const res = await updateEducation(editingId, payload);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else if (res.data) {
          setEducation(education.map((e) => (e.id === editingId ? res.data : e)));
          resetForm();
        }
      } else {
        const res = await createEducation(payload);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          setEducation([res.data, ...education]);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Education CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage academic institutions, degrees, and FE RUPP credentials ({education.length} active).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncRupp}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="gap-1.5 font-mono text-xs border-primary/30 hover:bg-primary/10"
            title="Sync official RUPP Faculty of Engineering ITE Program 7 credentials"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-primary" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync FE RUPP Program 7"}</span>
          </Button>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm" className="gap-1.5 font-mono text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Education</span>
            </Button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{editingId ? "Update Academic Record" : "Add Academic Record"}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillRuppTemplate}
                className="text-[11px] font-mono text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5"
                title="Auto-fill form with RUPP Faculty of Engineering Program 7 official details"
              >
                <BookOpen className="h-3 w-3" />
                <span>Fill RUPP Program 7 Template</span>
              </button>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Institution *</label>
                <Input
                  required
                  placeholder="State University of Technology"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Degree / Field *</label>
                <Input
                  required
                  placeholder="B.S. in Computer Science"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Description / Focus Areas</label>
              <Textarea
                rows={2}
                placeholder="Coursework focus, honors, research topics"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Start Date *</label>
                <Input
                  required
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">End Date</label>
                <Input
                  type="date"
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="border-b border-border bg-secondary/50 text-muted-foreground text-left">
            <tr>
              <th className="p-4">Institution</th>
              <th className="p-4">Degree</th>
              <th className="p-4">Dates</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {education.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No education records found.
                </td>
              </tr>
            ) : (
              education.map((edu) => {
                const isRupp =
                  edu.institution.toLowerCase().includes("rupp") ||
                  edu.institution.toLowerCase().includes("royal university of phnom penh");

                return (
                  <tr key={edu.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{edu.institution}</span>
                        {isRupp && (
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.2 text-[9px] font-mono text-primary font-semibold">
                            Program 7
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-primary font-medium">{edu.degree}</td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                    </td>
                    <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
