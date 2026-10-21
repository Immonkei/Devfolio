import { describe, it, expect } from "vitest";
import {
  extractProjectImages,
  cleanNarrativeContent,
  serializeProjectGallery,
} from "../project-images";

describe("project-images utilities", () => {
  it("extracts cover image when only cover is present", () => {
    const project = {
      title: "Finora",
      cover_image_url: "https://example.com/cover.webp",
      description: "Simple narrative without pictures.",
    };

    const images = extractProjectImages(project);
    expect(images).toHaveLength(1);
    expect(images[0]).toEqual({
      url: "https://example.com/cover.webp",
      alt: "Finora - Cover",
      isCover: true,
    });
  });

  it("extracts cover image and markdown images, deduplicating URLs", () => {
    const project = {
      title: "Finora",
      cover_image_url: "https://example.com/cover.webp",
      description: `
Check out the screens:
![Cover Image](https://example.com/cover.webp)
![Dashboard Overview](https://example.com/demo-2.webp)
![Analytics View](https://example.com/demo-3.webp)
      `,
    };

    const images = extractProjectImages(project);
    expect(images).toHaveLength(3);
    expect(images[0].url).toBe("https://example.com/cover.webp");
    expect(images[0].isCover).toBe(true);
    expect(images[1].url).toBe("https://example.com/demo-2.webp");
    expect(images[1].alt).toBe("Dashboard Overview");
    expect(images[2].url).toBe("https://example.com/demo-3.webp");
    expect(images[2].alt).toBe("Analytics View");
  });

  it("falls back to default blueprint when no images exist", () => {
    const project = {
      title: "Empty Project",
      cover_image_url: null,
      description: "",
    };

    const images = extractProjectImages(project);
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe("/projects/default-project.svg");
    expect(images[0].isCover).toBe(true);
  });

  it("cleans gallery block from narrative content", () => {
    const text = `
This is the core narrative of the system.

<!-- project-gallery -->
![Screenshot 1](https://example.com/1.png)
![Screenshot 2](https://example.com/2.png)
<!-- /project-gallery -->
    `;

    const cleaned = cleanNarrativeContent(text);
    expect(cleaned).toBe("This is the core narrative of the system.");
    expect(cleaned).not.toContain("project-gallery");
  });

  it("serializes gallery images cleanly onto narrative", () => {
    const narrative = "This is my initial text.";
    const gallery = [
      { url: "https://example.com/1.webp", alt: "Overview" },
      { url: "https://example.com/2.webp", alt: "Settings" },
    ];

    const result = serializeProjectGallery(narrative, gallery);
    expect(result).toContain("This is my initial text.");
    expect(result).toContain("<!-- project-gallery -->");
    expect(result).toContain("![Overview](https://example.com/1.webp)");
    expect(result).toContain("![Settings](https://example.com/2.webp)");
    expect(result).toContain("<!-- /project-gallery -->");

    // Cleaning it extracts original text
    expect(cleanNarrativeContent(result)).toBe(narrative);
  });
});
