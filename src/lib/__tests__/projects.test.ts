import { describe, it, expect } from "vitest";
import { STANDARD_PROJECTS, getStandardProjectBySlug } from "@/lib/constants/projects";

describe("STANDARD_PROJECTS authentic repository fixtures", () => {
  it("contains all 9 authentic GitHub projects for Immonkei", () => {
    expect(STANDARD_PROJECTS).toHaveLength(9);
  });

  it("ensures each project has valid attributes and Immonkei GitHub repository links", () => {
    for (const project of STANDARD_PROJECTS) {
      expect(project.id).toBeDefined();
      expect(project.title).toBeTruthy();
      expect(project.slug).toBeTruthy();
      expect(project.short_description).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.problem).toBeTruthy();
      expect(project.solution).toBeTruthy();
      expect(project.architecture).toBeTruthy();
      expect(project.status).toBe("PUBLISHED");
      expect(project.cover_image_url).toMatch(/^(\/projects\/[a-z0-9-]+\.svg|https:\/\/.+)$/);
      expect(project.github_url).toMatch(/^https:\/\/github\.com\/Immonkei\//);
      expect(project.technologies.length).toBeGreaterThan(0);
    }
  });

  it("correctly finds projects by slug case-insensitively", () => {
    const finora = getStandardProjectBySlug("FINORA");
    expect(finora).toBeDefined();
    expect(finora?.slug).toBe("finora");
    expect(finora?.title).toContain("Finora");

    const easelife = getStandardProjectBySlug("EASELIFE");
    expect(easelife).toBeDefined();
    expect(easelife?.slug).toBe("easelife");
    expect(easelife?.title).toContain("EaseLife");

    const borejak = getStandardProjectBySlug("borejak");
    expect(borejak).toBeDefined();
    expect(borejak?.slug).toBe("borejak");

    const nonExistent = getStandardProjectBySlug("non-existent-project");
    expect(nonExistent).toBeUndefined();
  });
});
