import { NextResponse } from "next/server";
import { submitGuess } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;
    const body = await request.json();
    const { sessionId, questionId, guessedAnswer, verificationToken } = body;

    if (!sessionId || !questionId || typeof guessedAnswer !== "string") {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const { result, error } = await submitGuess(sessionId, testId, questionId, guessedAnswer, verificationToken);
    if (error || !result) {
      return NextResponse.json({ error: error || "Failed to process guess" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("POST /guess error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
