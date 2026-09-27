"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema, ProjectInput } from "@/lib/validations/project";
import { Technology, ProjectStatus, ProjectWithTechnologies } from "@/types";
import { STANDARD_PROJECTS } from "@/lib/constants/projects";

export async function getProjects(): Promise<ProjectWithTechnologies[]> {
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

export async function getProjectBySlug(slug: string): Promise<ProjectWithTechnologies | null> {
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

export async function syncStandardProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  // Fetch all existing technologies in the database
  const { data: dbTechnologies } = await supabase
    .from("technologies")
    .select("id, name");

  const techMap = new Map<string, string>();
  if (dbTechnologies) {
    dbTechnologies.forEach((t) => {
      techMap.set(t.name.toLowerCase().trim(), t.id);
    });
  }

  let insertedCount = 0;
  let updatedCount = 0;

  for (const p of STANDARD_PROJECTS) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", p.slug)
      .maybeSingle();

    const payload = {
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      description: p.description,
      problem: p.problem,
      solution: p.solution,
      architecture: p.architecture,
      implementation: p.implementation,
      challenges: p.challenges,
      tradeoffs: p.tradeoffs,
      results: p.results,
      cover_image_url: p.cover_image_url,
      github_url: p.github_url,
      live_url: p.live_url,
      featured: p.featured,
      status: p.status,
      display_order: p.display_order,
      updated_at: new Date().toISOString(),
    };

    let targetProjectId = p.id;

    if (existing) {
      targetProjectId = existing.id;
      await supabase.from("projects").update(payload).eq("id", existing.id);
      updatedCount++;
    } else {
      const { data: createdProject } = await supabase
        .from("projects")
        .insert({
          id: p.id,
          ...payload,
        })
        .select("id")
        .single();

      if (createdProject) {
        targetProjectId = createdProject.id;
      }
      insertedCount++;
    }

    // Associate technologies
    if (p.technologies && p.technologies.length > 0) {
      const matchedTechIds = p.technologies
        .map((t) => techMap.get(t.name.toLowerCase().trim()))
        .filter(Boolean) as string[];

      if (matchedTechIds.length > 0) {
        await supabase
          .from("project_technologies")
          .delete()
          .eq("project_id", targetProjectId);

        const junctions = matchedTechIds.map((techId) => ({
          project_id: targetProjectId,
          technology_id: techId,
        }));
        await supabase.from("project_technologies").insert(junctions);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    message: `Synchronized ${insertedCount} new projects and updated ${updatedCount} existing projects.`,
  };
}
