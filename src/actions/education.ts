"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { educationSchema, EducationInput } from "@/lib/validations/education";

export async function getEducation() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }

  return data || [];
}

export async function createEducation(input: EducationInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid education input." };
  }

  const { data, error } = await supabase
    .from("education")
    .insert([
      {
        ...parsed.data,
        description: parsed.data.description || null,
        end_date: parsed.data.end_date || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/experience");
  revalidatePath("/about");
  revalidatePath("/admin/education");

  return { success: true, data };
}

export async function updateEducation(id: string, input: EducationInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid education input." };
  }

  const { data, error } = await supabase
    .from("education")
    .update({
      ...parsed.data,
      description: parsed.data.description || null,
      end_date: parsed.data.end_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/experience");
  revalidatePath("/about");
  revalidatePath("/admin/education");

  return { success: true, data };
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { error } = await supabase.from("education").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/experience");
  revalidatePath("/about");
  revalidatePath("/admin/education");

  return { success: true };
}
