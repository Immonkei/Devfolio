import { NextRequest, NextResponse } from "next/server";
import { submitContactMessage } from "@/actions/messages";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await submitContactMessage(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch {
    return NextResponse.json(
      { error: "Internal server processing error." },
      { status: 500 }
    );
  }
}
