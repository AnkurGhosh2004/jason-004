import { NextResponse } from "next/server";
import { saveTest } from "@/lib/db";
import { generateSecureId, sanitizeName } from "@/lib/utils";
import { getQuestionsForCount } from "@/lib/questions/data";
import { TestSession } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creatorName, questionCount = 12, creatorAnswers } = body;

    const sanitizedCreatorName = sanitizeName(creatorName || "Anonymous");
    if (!sanitizedCreatorName) {
      return NextResponse.json({ error: "Creator name is required" }, { status: 400 });
    }

    if (!creatorAnswers || typeof creatorAnswers !== "object") {
      return NextResponse.json({ error: "Creator answers are required" }, { status: 400 });
    }

    const count = [10, 12, 15].includes(Number(questionCount)) ? Number(questionCount) : 12;
    const questions = getQuestionsForCount(count);
    const questionIds = questions.map((q) => q.id);

    // Verify all questions are answered
    for (const qId of questionIds) {
      if (!creatorAnswers[qId] || typeof creatorAnswers[qId] !== "string") {
        return NextResponse.json(
          { error: `Missing answer for question ${qId}` },
          { status: 400 }
        );
      }
    }

    const testId = generateSecureId(8);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const newTest: TestSession = {
      id: testId,
      creatorName: sanitizedCreatorName,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: "active",
      questionCount: count,
      questionIds,
      creatorAnswers,
    };

    const result = await saveTest(newTest);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save test" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      testId,
      expiresAt: newTest.expiresAt,
    });
  } catch (error) {
    console.error("API /api/tests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
