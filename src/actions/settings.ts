"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export async function getProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function upsertProfile(id: string | null | undefined, formData: Partial<Profile>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const payload = {
    name: formData.name || "Min Phanith",
    headline: formData.headline || "Junior Full-Stack Developer",
    bio: formData.bio || "",
    location: formData.location || "Phnom Penh, Cambodia",
    avatar_url: formData.avatar_url || null,
    resume_url: formData.resume_url || null,
    github_url: formData.github_url || null,
    linkedin_url: formData.linkedin_url || null,
    twitter_url: formData.twitter_url || null,
    role: formData.role || "Junior Full-Stack Developer",
    updated_at: new Date().toISOString(),
  };

  // If ID provided, update directly
  if (id) {
    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return { success: true, data };
  }

  // Check if an existing profile row exists in the database
  const { data: existing } = await supabase.from("profiles").select("id").limit(1).maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/settings");
    return { success: true, data };
  }

  // Otherwise insert a new record
  const { data, error } = await supabase
    .from("profiles")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");

  return { success: true, data };
}

export async function updateProfile(id: string, formData: Partial<Profile>) {
  return upsertProfile(id, formData);
}
