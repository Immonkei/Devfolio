import { describe, it, expect } from "vitest";
import { GET } from "../download/route";
import { NextRequest } from "next/server";

describe("Resume Download API Route", () => {
  it("serves PDF with attachment disposition by default", async () => {
    const req = new NextRequest("http://localhost:3000/api/resume/download");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain('attachment; filename="Min_Phanith_CV.pdf"');
  });

  it("serves PDF with inline disposition when view=true is requested", async () => {
    const req = new NextRequest("http://localhost:3000/api/resume/download?view=true");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain('inline; filename="Min_Phanith_CV.pdf"');
  });
});
