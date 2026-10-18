"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export interface UploadedMediaResult {
  url: string;
  fileName: string;
  id?: string;
  size: number;
}

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
  "application/pdf",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit

function getStorageClient() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

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

async function processAndSaveFile(
  file: File,
  storageClient: NonNullable<ReturnType<typeof getStorageClient>>
): Promise<{ success: true; data: UploadedMediaResult } | { success: false; error: string }> {
  if (file.size > MAX_SIZE) {
    return { success: false, error: `${file.name}: Payload exceeds 10MB maximum limit.` };
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return { success: false, error: `${file.name}: Disallowed media format (${file.type}).` };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;
  const filePath = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await storageClient.storage
    .from("portfolio")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: `${file.name}: ${uploadError.message}` };
  }

  const { data: publicUrlData } = storageClient.storage
    .from("portfolio")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  const { data: mediaRecord, error: dbError } = await storageClient
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

  return {
    success: true,
    data: {
      url: publicUrl,
      fileName: file.name,
      id: mediaRecord?.id,
      size: file.size,
    },
  };
}

export async function uploadMediaFile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const file = formData.get("file") as File;
  if (!file || !(file instanceof File)) {
    return { success: false, error: "No file provided for upload." };
  }

  const storageClient = getStorageClient() || supabase;
  const result = await processAndSaveFile(file, storageClient);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/posts");

  return {
    success: true,
    data: result.data,
  };
}

export async function uploadMultipleMediaFiles(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required.", data: [] };
  }

  const rawFiles = formData.getAll("files");
  const files: File[] = [];

  for (const item of rawFiles) {
    if (item instanceof File && item.size > 0) {
      files.push(item);
    }
  }

  if (files.length === 0) {
    const single = formData.get("file");
    if (single instanceof File && single.size > 0) {
      files.push(single);
    }
  }

  if (files.length === 0) {
    return { success: false, error: "No valid image files provided.", data: [] };
  }

  const storageClient = getStorageClient() || supabase;
  const uploadedResults: UploadedMediaResult[] = [];
  const errors: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const result = await processAndSaveFile(file, storageClient);
        if (result.success) {
          uploadedResults.push(result.data);
        } else {
          errors.push(result.error);
        }
      } catch (err: unknown) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : "Upload exception"}`);
      }
    })
  );

  revalidatePath("/admin/media");
  revalidatePath("/admin/posts");

  if (uploadedResults.length === 0 && errors.length > 0) {
    return {
      success: false,
      error: errors.join(" | "),
      data: [],
    };
  }

  return {
    success: true,
    data: uploadedResults,
    error: errors.length > 0 ? errors.join(" | ") : undefined,
  };
}

export async function deleteMediaItem(id: string, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const storageClient = getStorageClient() || supabase;

  // Delete DB record
  const { error: dbError } = await storageClient.from("media").delete().eq("id", id);
  if (dbError) {
    return { success: false, error: dbError.message };
  }

  // Attempt storage object deletion if local path
  try {
    const parts = storagePath.split("/portfolio/");
    if (parts.length > 1) {
      await storageClient.storage.from("portfolio").remove([parts[1]]);
    }
  } catch (err) {
    console.warn("Storage deletion error (non-fatal):", err);
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/posts");

  return { success: true };
}
