"use client";

import { useState } from "react";
import { createEducation, updateEducation, deleteEducation } from "@/actions/education";
import { Education } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export function EducationCMS({ initialEducation }: { initialEducation: Education[] }) {
  const [education, setEducation] = useState(initialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Education CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage academic institutions, degrees, and honors.
          </p>
        </div>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Education</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground">
              {editingId ? "Update Academic Record" : "Add Academic Record"}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
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
              education.map((edu) => (
                <tr key={edu.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{edu.institution}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
