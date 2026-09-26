"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export async function getProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").limit(1).single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateProfile(id: string, formData: Partial<Profile>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: formData.name,
      headline: formData.headline,
      bio: formData.bio,
      location: formData.location,
      avatar_url: formData.avatar_url || null,
      resume_url: formData.resume_url || null,
      github_url: formData.github_url || null,
      linkedin_url: formData.linkedin_url || null,
      twitter_url: formData.twitter_url || null,
      role: formData.role,
      updated_at: new Date().toISOString(),
    })
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
