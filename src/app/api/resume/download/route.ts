import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isInline = searchParams.get("view") === "true" || searchParams.get("inline") === "true";

    // 1. Direct local file check for instant response with zero network latency
    const localFilePath = path.join(process.cwd(), "public", "resume.pdf");

    if (fs.existsSync(localFilePath)) {
      const fileBuffer = await fs.promises.readFile(localFilePath);
      const disposition = isInline
        ? 'inline; filename="Min_Phanith_CV.pdf"'
        : 'attachment; filename="Min_Phanith_CV.pdf"';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": disposition,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    return NextResponse.json(
      { error: "CV file not found on server." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to download CV." },
      { status: 500 }
    );
  }
}
