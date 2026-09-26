"use client";

import { useState } from "react";
import { createTechnology, updateTechnology, deleteTechnology } from "@/actions/technologies";
import { Technology, TechCategory } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES: TechCategory[] = [
  "LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "DEVOPS",
  "TOOL",
  "OTHER",
];

export function TechnologiesCMS({ initialTechnologies }: { initialTechnologies: Technology[] }) {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "TOOL" as TechCategory,
    icon: "",
  });

  const resetForm = () => {
    setForm({ name: "", category: "TOOL", icon: "" });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = (t: Technology) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      category: t.category,
      icon: t.icon || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this technology?")) return;
    const res = await deleteTechnology(id);
    if (res.success) {
      setTechnologies(technologies.filter((t) => t.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      icon: form.icon || null,
    };

    try {
      if (editingId) {
        const res = await updateTechnology(editingId, payload);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else if (res.data) {
          setTechnologies(technologies.map((t) => (t.id === editingId ? res.data : t)));
          resetForm();
        }
      } else {
        const res = await createTechnology(payload);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          setTechnologies([...technologies, res.data]);
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
            Technologies CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage production stack elements, languages, and infrastructure tools.
          </p>
        </div>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Technology</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground">
              {editingId ? "Update Technology" : "Register New Technology"}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Technology Name *</label>
                <Input
                  required
                  placeholder="e.g. TypeScript, Go, PostgreSQL"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as TechCategory })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Icon Identifier</label>
                <Input
                  placeholder="e.g. go, rust, postgresql"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? "Persisting..." : editingId ? "Save Changes" : "Register Technology"}
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
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Icon Key</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {technologies.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No technologies registered.
                </td>
              </tr>
            ) : (
              technologies.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{t.name}</td>
                  <td className="p-4">
                    <span className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-[10px] text-primary">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{t.icon || "—"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
