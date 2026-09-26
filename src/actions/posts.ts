"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { postSchema, PostInput } from "@/lib/validations/post";
import { Category, PostStatus } from "@/types";

export async function getPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_categories(category_id, categories(*))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data || []).map((p) => ({
    ...p,
    categories: (p.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
  }));
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_categories(category_id, categories(*))")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    categories: (data.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
  };
}

export async function createPost(input: PostInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid post input." };
  }

  const { category_ids, ...postData } = parsed.data;

  const publishedAt =
    postData.status === "PUBLISHED" ? new Date().toISOString() : null;

  const { data: post, error: insertError } = await supabase
    .from("posts")
    .insert([
      {
        ...postData,
        cover_image_url: postData.cover_image_url || null,
        published_at: publishedAt,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  if (category_ids && category_ids.length > 0 && post) {
    const junctions = category_ids.map((catId) => ({
      post_id: post.id,
      category_id: catId,
    }));
    await supabase.from("post_categories").insert(junctions);
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath(`/notes/${post.slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");

  return { success: true, data: post };
}

export async function updatePost(id: string, input: PostInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid post input." };
  }

  const { category_ids, ...postData } = parsed.data;

  const { data: post, error: updateError } = await supabase
    .from("posts")
    .update({
      ...postData,
      cover_image_url: postData.cover_image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (category_ids) {
    await supabase.from("post_categories").delete().eq("post_id", id);
    if (category_ids.length > 0) {
      const junctions = category_ids.map((catId) => ({
        post_id: id,
        category_id: catId,
      }));
      await supabase.from("post_categories").insert(junctions);
    }
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath(`/notes/${post.slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");

  return { success: true, data: post };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function togglePostPublish(id: string, currentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const publishedAt = newStatus === "PUBLISHED" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("posts")
    .update({
      status: newStatus as PostStatus,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");

  return { success: true, newStatus };
}
