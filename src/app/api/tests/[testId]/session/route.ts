import { NextResponse } from "next/server";
import { createFriendSession, getTestMeta } from "@/lib/db";
import { sanitizeName } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const body = await request.json().catch(() => ({}));
    const { friendName = "", sessionId: clientSessionId } = body;

    const test = await getTestMeta(testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }
    if (test.isExpired) {
      return NextResponse.json({ error: "This Lie Loop has expired" }, { status: 410 });
    }

    const cleanFriendName = sanitizeName(friendName || "Friend");
    const result = await createFriendSession(testId, cleanFriendName, clientSessionId);
    if (!result) {
      return NextResponse.json({ error: "Failed to initialize game session" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sessionId: result.sessionId });
  } catch (error) {
    console.error("POST session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
