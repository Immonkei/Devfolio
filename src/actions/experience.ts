"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { experienceSchema, ExperienceInput } from "@/lib/validations/experience";

export async function getExperiences() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  return data || [];
}

export async function createExperience(input: ExperienceInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid experience input." };
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert([
      {
        ...parsed.data,
        end_date: parsed.data.is_current ? null : parsed.data.end_date || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");

  return { success: true, data };
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid experience input." };
  }

  const { data, error } = await supabase
    .from("experiences")
    .update({
      ...parsed.data,
      end_date: parsed.data.is_current ? null : parsed.data.end_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");

  return { success: true, data };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/admin/experience");

  return { success: true };
}
