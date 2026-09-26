"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getMediaItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media:", error);
    return [];
  }

  return data || [];
}

export async function uploadMediaFile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided for upload." };
  }

  // 10MB limit
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: "Payload exceeds 10MB maximum limit." };
  }

  // Allowed MIME types
  const allowedMime = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "application/pdf",
  ];

  if (!allowedMime.includes(file.type)) {
    return { success: false, error: `Disallowed media format: ${file.type}` };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("portfolio")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  // Insert metadata record into media table
  const { data: mediaRecord, error: dbError } = await supabase
    .from("media")
    .insert([
      {
        file_name: file.name,
        storage_path: publicUrl,
        file_type: file.type,
        file_size: file.size,
        bucket: "portfolio",
      },
    ])
    .select()
    .single();

  if (dbError) {
    console.error("Database media record insert error:", dbError);
  }

  revalidatePath("/admin/media");

  return {
    success: true,
    data: {
      url: publicUrl,
      fileName: file.name,
      id: mediaRecord?.id,
    },
  };
}

export async function deleteMediaItem(id: string, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  // Delete DB record
  const { error: dbError } = await supabase.from("media").delete().eq("id", id);
  if (dbError) {
    return { success: false, error: dbError.message };
  }

  // Attempt storage object deletion if local path
  try {
    const parts = storagePath.split("/portfolio/");
    if (parts.length > 1) {
      await supabase.storage.from("portfolio").remove([parts[1]]);
    }
  } catch (err) {
    console.warn("Storage deletion error (non-fatal):", err);
  }

  revalidatePath("/admin/media");

  return { success: true };
}
