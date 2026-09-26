"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema, ProjectInput } from "@/lib/validations/project";
import { Technology, ProjectStatus } from "@/types";

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_technologies(technology_id, technologies(*))")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data || []).map((p) => ({
    ...p,
    technologies: (p.project_technologies || []).map((pt: { technologies: Technology | null }) => pt.technologies).filter(Boolean) as Technology[],
  }));
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_technologies(technology_id, technologies(*))")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    technologies: (data.project_technologies || []).map((pt: { technologies: Technology | null }) => pt.technologies).filter(Boolean) as Technology[],
  };
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid project input." };
  }

  const { technology_ids, ...projectData } = parsed.data;

  // Insert project
  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert([
      {
        ...projectData,
        cover_image_url:
          projectData.cover_image_url && projectData.cover_image_url.trim().length > 0
            ? projectData.cover_image_url.trim()
            : "/projects/default-project.svg",
        github_url: projectData.github_url || null,
        live_url: projectData.live_url || null,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Link technologies
  if (technology_ids && technology_ids.length > 0 && project) {
    const junctions = technology_ids.map((techId) => ({
      project_id: project.id,
      technology_id: techId,
    }));
    await supabase.from("project_technologies").insert(junctions);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true, data: project };
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid project input." };
  }

  const { technology_ids, ...projectData } = parsed.data;

  const { data: project, error: updateError } = await supabase
    .from("projects")
    .update({
      ...projectData,
      cover_image_url:
        projectData.cover_image_url && projectData.cover_image_url.trim().length > 0
          ? projectData.cover_image_url.trim()
          : "/projects/default-project.svg",
      github_url: projectData.github_url || null,
      live_url: projectData.live_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Update technologies junction
  if (technology_ids) {
    await supabase.from("project_technologies").delete().eq("project_id", id);
    if (technology_ids.length > 0) {
      const junctions = technology_ids.map((techId) => ({
        project_id: id,
        technology_id: techId,
      }));
      await supabase.from("project_technologies").insert(junctions);
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true, data: project };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function toggleProjectPublish(id: string, currentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus as ProjectStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return { success: true, newStatus };
}
