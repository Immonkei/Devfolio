"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { postSchema, PostInput } from "@/lib/validations/post";
import { Category, PostStatus, PostWithCategories } from "@/types";

export const getPosts = cache(async (): Promise<PostWithCategories[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_categories(category_id, categories(*))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    cover_image_url: p.cover_image_url,
    status: p.status,
    published_at: p.published_at,
    created_at: p.created_at,
    updated_at: p.updated_at,
    categories: (p.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
  }));
});

export const getPostBySlug = cache(async (slug: string): Promise<PostWithCategories | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_categories(category_id, categories(*))")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    cover_image_url: data.cover_image_url,
    status: data.status,
    published_at: data.published_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    categories: (data.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
  };
});

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
        cover_image_url:
          postData.cover_image_url && postData.cover_image_url.trim().length > 0
            ? postData.cover_image_url.trim()
            : "/notes/default-note.svg",
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
      cover_image_url:
        postData.cover_image_url && postData.cover_image_url.trim().length > 0
          ? postData.cover_image_url.trim()
          : "/notes/default-note.svg",
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

export async function syncStandardPosts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized: Administrator privileges required." };
  }

  const { STANDARD_POSTS } = await import("@/lib/constants/posts");
  let synced = 0;

  for (const post of STANDARD_POSTS) {
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    const payload = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url,
      status: post.status,
      published_at: post.published_at,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("posts").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("posts").insert([{ id: post.id, ...payload }]);
    }
    synced++;
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    message: `Successfully synchronized ${synced} engineering notes into database.`,
  };
}
