import { NextResponse } from "next/server";
import { getFriendSession, getTestMeta } from "@/lib/db";
import { calculateScoreReport } from "@/lib/scoring/engine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const session = await getFriendSession(sessionId);
    if (!session || session.testId !== testId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const testMeta = await getTestMeta(testId);
    const creatorName = testMeta?.creatorName || "Your friend";
    const report = calculateScoreReport(session.guesses, creatorName);

    return NextResponse.json({
      success: true,
      report,
      friendName: session.friendName,
      creatorName,
      completedAt: session.completedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET result error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
