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

const RUPP_ITE_PROGRAM = {
  institution: "Faculty of Engineering, Royal University of Phnom Penh (RUPP)",
  degree: "Bachelor of Information Technology Engineering (ITE)",
  description:
    "Accredited 4-year engineering program emphasizing software engineering, computer organization, and practical system development. Core curriculum and practicum include Advanced Programming, Data Structures & Algorithms, Object-Oriented Analysis & Design (OOAD), Web Technologies & Cloud Computing, Database Systems II, Operating Systems, Mobile Application Development, Information Security, and Capstone Final Project.",
  start_date: "2023-10-01",
  end_date: "2027-07-31",
  display_order: 1,
};

export async function syncRuppEducation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  // Check if an education record already exists
  const { data: existing } = await supabase
    .from("education")
    .select("id, institution")
    .limit(1);

  let error;
  if (existing && existing.length > 0) {
    const res = await supabase
      .from("education")
      .update({
        institution: RUPP_ITE_PROGRAM.institution,
        degree: RUPP_ITE_PROGRAM.degree,
        description: RUPP_ITE_PROGRAM.description,
        start_date: RUPP_ITE_PROGRAM.start_date,
        end_date: RUPP_ITE_PROGRAM.end_date,
        display_order: RUPP_ITE_PROGRAM.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing[0].id);
    error = res.error;
  } else {
    const res = await supabase.from("education").insert([RUPP_ITE_PROGRAM]);
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/experience");
  revalidatePath("/about");
  revalidatePath("/admin/education");

  return {
    success: true,
    message: "Successfully synchronized RUPP ITE Program 7 credentials into database.",
  };
}

