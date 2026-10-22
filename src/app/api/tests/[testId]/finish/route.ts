import { NextResponse } from "next/server";
import { completeFriendSession } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const body = await request.json();
    const { sessionId, guesses, friendName } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const { report, session, error } = await completeFriendSession(
      sessionId,
      guesses,
      testId,
      friendName
    );
    if (error || !report) {
      return NextResponse.json({ error: error || "Failed to complete session" }, { status: 400 });
    }

    return NextResponse.json({ success: true, report, session });
  } catch (error) {
    console.error("POST finish error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
