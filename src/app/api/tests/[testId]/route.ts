import { NextResponse } from "next/server";
import { getTestMeta } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    if (!testId) {
      return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
    }

    const test = await getTestMeta(testId);
    if (!test) {
      return NextResponse.json({ error: "Lie Loop test not found" }, { status: 404 });
    }

    if (test.isExpired) {
      return NextResponse.json(
        { error: "This Lie Loop has expired", isExpired: true, test },
        { status: 410 }
      );
    }

    return NextResponse.json({ success: true, test });
  } catch (error) {
    console.error("GET /api/tests/[testId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
