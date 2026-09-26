import { getMediaItems } from "@/actions/media";
import { MediaCMS } from "@/components/admin/media-cms";

export const metadata = {
  title: "Media Assets CMS",
};

export default async function AdminMediaPage() {
  const media = await getMediaItems();
  return <MediaCMS initialMedia={media} />;
}
