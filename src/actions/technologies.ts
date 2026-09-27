"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { technologySchema, TechnologyInput } from "@/lib/validations/technology";

export async function getTechnologies() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching technologies:", error);
    return [];
  }

  return data || [];
}

export async function createTechnology(input: TechnologyInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid technology input." };
  }

  const { data, error } = await supabase
    .from("technologies")
    .insert([
      {
        ...parsed.data,
        icon: parsed.data.icon || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/technologies");

  return { success: true, data };
}

export async function updateTechnology(id: string, input: TechnologyInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid technology input." };
  }

  const { data, error } = await supabase
    .from("technologies")
    .update({
      ...parsed.data,
      icon: parsed.data.icon || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/technologies");

  return { success: true, data };
}

export async function deleteTechnology(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { error } = await supabase.from("technologies").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/technologies");

  return { success: true };
}

export async function syncStandardTechnologies() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { data: current } = await supabase.from("technologies").select("name");
  const existingNames = new Set((current || []).map((t: { name: string }) => t.name.toLowerCase().trim()));

  const { STANDARD_TECHNOLOGIES } = await import("@/lib/tech-icons");
  const toInsert = STANDARD_TECHNOLOGIES.filter(
    (st) => !existingNames.has(st.name.toLowerCase().trim())
  );

  if (toInsert.length === 0) {
    return { success: true, count: 0, message: "All 41 technologies are already registered in the database." };
  }

  const { error } = await supabase.from("technologies").insert(toInsert);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/technologies");

  return {
    success: true,
    count: toInsert.length,
    message: `Successfully populated ${toInsert.length} technologies into the database.`,
  };
}

