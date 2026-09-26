"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { contactSchema, ContactInput } from "@/lib/validations/contact";

export async function submitContactMessage(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid contact input.",
    };
  }

  // Honeypot check: If the hidden website input has any text, silently reject spam
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([
      {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: "NEW",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error submitting contact message:", error);
    return {
      success: false,
      error: "Failed to dispatch communication. Please retry or contact directly via email.",
    };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");

  return { success: true, data };
}

export async function getContactMessages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }

  return data || [];
}

export async function updateMessageStatus(id: string, status: "NEW" | "READ" | "ARCHIVED") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function deleteContactMessage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
