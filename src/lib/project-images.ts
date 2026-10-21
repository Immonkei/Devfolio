export interface ProjectImage {
  url: string;
  alt: string;
  isCover?: boolean;
}

const DEFAULT_COVER = "/projects/default-project.svg";

/**
 * Extracts all valid project images from cover_image_url and narrative description.
 * Deduplicates by URL and preserves order with cover image first.
 */
export function extractProjectImages(project: {
  cover_image_url?: string | null;
  description?: string | null;
  title?: string;
}): ProjectImage[] {
  const images: ProjectImage[] = [];
  const seenUrls = new Set<string>();

  const coverUrl = project.cover_image_url?.trim();
  if (coverUrl && coverUrl.length > 0 && coverUrl !== DEFAULT_COVER) {
    seenUrls.add(coverUrl);
    images.push({
      url: coverUrl,
      alt: `${project.title || "Project"} - Cover`,
      isCover: true,
    });
  }

  const description = project.description || "";
  const markdownImageRegex = /!\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = markdownImageRegex.exec(description)) !== null) {
    const rawAlt = match[1]?.trim();
    const url = match[2]?.trim();

    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      const cleanAlt =
        rawAlt && rawAlt.length > 0
          ? rawAlt
          : `${project.title || "Project"} Screenshot ${images.length + 1}`;

      images.push({
        url,
        alt: cleanAlt,
        isCover: images.length === 0,
      });
    }
  }

  // Fallback if no images found
  if (images.length === 0) {
    images.push({
      url: coverUrl || DEFAULT_COVER,
      alt: `${project.title || "Project"} Blueprint`,
      isCover: true,
    });
  }

  return images;
}

/**
 * Removes the dedicated project gallery block from markdown content so that
 * narrative text can be cleanly rendered without repeating gallery images.
 */
export function cleanNarrativeContent(description: string): string {
  if (!description) return "";

  // Remove <!-- project-gallery --> ... <!-- /project-gallery -->
  const stripped = description
    .replace(/<!--\s*project-gallery\s*-->[\s\S]*?<!--\s*\/project-gallery\s*-->/gi, "")
    .trim();

  return stripped;
}

/**
 * Serializes gallery images into a structured markdown block at the end of the narrative.
 */
export function serializeProjectGallery(
  narrative: string,
  galleryImages: Array<{ url: string; alt?: string; fileName?: string }>
): string {
  const cleanNarrative = cleanNarrativeContent(narrative);

  if (!galleryImages || galleryImages.length === 0) {
    return cleanNarrative;
  }

  const galleryTags = galleryImages
    .filter((img) => Boolean(img.url && img.url.trim().length > 0))
    .map((img, idx) => {
      const altText =
        img.alt?.trim() ||
        img.fileName?.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() ||
        `Screenshot ${idx + 1}`;
      return `![${altText}](${img.url.trim()})`;
    })
    .join("\n");

  if (!galleryTags) {
    return cleanNarrative;
  }

  const galleryBlock = `\n\n<!-- project-gallery -->\n${galleryTags}\n<!-- /project-gallery -->`;

  return cleanNarrative ? `${cleanNarrative}${galleryBlock}` : galleryBlock.trim();
}
