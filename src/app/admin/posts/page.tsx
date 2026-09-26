import { getPosts } from "@/actions/posts";
import { createClient } from "@/lib/supabase/server";
import { PostsCMS } from "@/components/admin/posts-cms";

export const metadata = {
  title: "Engineering Notes CMS",
};

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const [posts, { data: categories }] = await Promise.all([
    getPosts(),
    supabase.from("categories").select("*"),
  ]);

  return <PostsCMS initialPosts={posts} allCategories={categories || []} />;
}
