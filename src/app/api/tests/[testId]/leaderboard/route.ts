import { NextResponse } from "next/server";
import { getTestMeta, getTestLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const test = await getTestMeta(testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const leaderboard = await getTestLeaderboard(testId);
    return NextResponse.json({
      success: true,
      creatorName: test.creatorName,
      leaderboard,
    });
  } catch (error) {
    console.error("GET leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
