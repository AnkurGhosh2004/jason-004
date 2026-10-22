import { 
  TestSession, 
  PublicTestMeta, 
  FriendSessionState, 
  GuessResult,
  Question,
  LeaderboardEntry 
} from "@/types";
import { getQuestionsForCount, getQuestionById } from "@/lib/questions/data";
import { calculateScoreReport, ScoreReport } from "@/lib/scoring/engine";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/client";
import { createVerificationToken, decryptVerificationToken } from "@/lib/security/token";

// Global in-memory fallback store across server reloads
interface GlobalStore {
  tests: Map<string, TestSession>;
  sessions: Map<string, FriendSessionState>;
}

const globalStore = (globalThis as unknown as { __lieloop_store?: GlobalStore });
if (!globalStore.__lieloop_store) {
  globalStore.__lieloop_store = {
    tests: new Map<string, TestSession>(),
    sessions: new Map<string, FriendSessionState>(),
  };
}
const store = globalStore.__lieloop_store;

// Fast in-memory cache for test metadata and creator answers
const testMetaCache = new Map<string, PublicTestMeta>();
const creatorAnswersCache = new Map<string, Record<string, string>>();

// Logging helper for Supabase errors
function logSupabaseError(context: string, error: unknown) {
  if (!error) return;
  const sb = error as { message?: string; code?: string; details?: string; hint?: string };
  console.error(`[Supabase Error: ${context}]`, {
    message: sb.message || String(error),
    code: sb.code || null,
    details: sb.details || null,
    hint: sb.hint || null,
  });
}

// Generate valid RFC4122 UUID v4 for PostgreSQL UUID columns
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ==========================================
// TEST CREATION & RETRIEVAL
// ==========================================

export async function saveTest(test: TestSession): Promise<{ success: boolean; error?: string }> {
  try {
    // Populate fast memory caches immediately
    store.tests.set(test.id, test);
    creatorAnswersCache.set(test.id, test.creatorAnswers);

    if (isSupabaseConfigured && supabaseAdmin) {
      const answersToInsert = Object.entries(test.creatorAnswers).map(([qId, ans]) => ({
        test_id: test.id,
        question_id: qId,
        answer: ans,
      }));

      // Insert test header and creator answers in parallel for 2x faster creation
      const [testRes, ansRes] = await Promise.all([
        supabaseAdmin.from("tests").insert({
          id: test.id,
          creator_name: test.creatorName,
          created_at: test.createdAt,
          expires_at: test.expiresAt,
          status: test.status,
          question_count: test.questionCount,
          question_ids: test.questionIds,
        }),
        supabaseAdmin.from("creator_answers").insert(answersToInsert),
      ]);

      if (testRes.error) {
        logSupabaseError("tests.insert", testRes.error);
        throw testRes.error;
      }
      if (ansRes.error) {
        logSupabaseError("creator_answers.insert", ansRes.error);
        throw ansRes.error;
      }
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Error saving test:", err);
    const errMsg = (err as { message?: string })?.message || "Failed to save test to database";
    return { success: false, error: errMsg };
  }
}

export async function getTestMeta(testId: string): Promise<PublicTestMeta | null> {
  try {
    const cached = testMetaCache.get(testId);
    if (cached) {
      return cached;
    }

    let testSession: TestSession | null = null;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) {
        logSupabaseError("tests.select", error);
      } else if (data) {
        testSession = {
          id: data.id,
          creatorName: data.creator_name,
          createdAt: data.created_at,
          expiresAt: data.expires_at,
          status: data.status,
          questionCount: data.question_count,
          questionIds: data.question_ids || [],
          creatorAnswers: {}, // Secret: not populated here!
        };
      }
    }

    if (!testSession) {
      testSession = store.tests.get(testId) || null;
    }

    if (!testSession) return null;

    const isExpired = new Date(testSession.expiresAt).getTime() < Date.now();

    // Map questions for this test
    const allQuestions = getQuestionsForCount(testSession.questionCount);
    const questionsForTest: Question[] = testSession.questionIds.length > 0
      ? (testSession.questionIds.map(id => getQuestionById(id)).filter(Boolean) as Question[])
      : allQuestions;

    const publicMeta: PublicTestMeta = {
      id: testSession.id,
      creatorName: testSession.creatorName,
      questionCount: testSession.questionCount,
      questions: questionsForTest,
      createdAt: testSession.createdAt,
      expiresAt: testSession.expiresAt,
      isExpired,
    };

    testMetaCache.set(testId, publicMeta);
    return publicMeta;
  } catch (err) {
    console.error("Error fetching test metadata:", err);
    return null;
  }
}

// Generate encrypted tamper-proof verification token for instant 0ms guess checks
export async function getTestVerificationToken(testId: string): Promise<string> {
  const answers = await getCreatorAnswersForTest(testId);
  return createVerificationToken(answers);
}

// Helper to batch-load and cache creator answers for a test
async function getCreatorAnswersForTest(testId: string): Promise<Record<string, string>> {
  const localTest = store.tests.get(testId);
  if (localTest && Object.keys(localTest.creatorAnswers).length > 0) {
    return localTest.creatorAnswers;
  }

  if (creatorAnswersCache.has(testId)) {
    return creatorAnswersCache.get(testId)!;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("creator_answers")
      .select("question_id, answer")
      .eq("test_id", testId);

    if (error) {
      logSupabaseError("creator_answers.select batch", error);
    } else if (data && data.length > 0) {
      const answersMap: Record<string, string> = {};
      data.forEach((ca) => {
        answersMap[ca.question_id] = ca.answer;
      });
      creatorAnswersCache.set(testId, answersMap);
      return answersMap;
    }
  }

  return {};
}

// Internal helper to retrieve secret creator answer for server-side verification (instant lookup)
async function getCreatorAnswer(testId: string, questionId: string): Promise<string | null> {
  const answers = await getCreatorAnswersForTest(testId);
  return answers[questionId] || null;
}

// ==========================================
// FRIEND SESSION & GUESS SUBMISSION
// ==========================================

export async function createFriendSession(
  testId: string, 
  friendName: string = "Anonymous Friend",
  customSessionId?: string
): Promise<{ sessionId: string } | null> {
  const sessionId = customSessionId || generateUUID();
  const newSession: FriendSessionState = {
    id: sessionId,
    testId,
    friendName: friendName.trim() || "Anonymous Friend",
    startedAt: new Date().toISOString(),
    currentQuestionIndex: 0,
    guesses: {},
  };

  store.sessions.set(sessionId, newSession);

  // Preload creator answers into memory cache in parallel
  getCreatorAnswersForTest(testId).catch(() => {});

  if (isSupabaseConfigured && supabaseAdmin) {
    // Non-blocking database write for instant speed
    Promise.resolve(
      supabaseAdmin.from("friend_sessions").insert({
        id: sessionId,
        test_id: testId,
        friend_name: newSession.friendName,
        created_at: newSession.startedAt,
      })
    ).then(({ error }) => {
      if (error) logSupabaseError("friend_sessions.insert", error);
    }).catch((e: unknown) => {
      logSupabaseError("friend_sessions.insert catch", e);
    });
  }

  return { sessionId };
}

export async function getFriendSession(sessionId: string): Promise<FriendSessionState | null> {
  const localSession = store.sessions.get(sessionId);
  if (localSession) {
    return localSession;
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from("friend_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (sessionError) {
        logSupabaseError("friend_sessions.select", sessionError);
        return null;
      }

      if (sessionData) {
        // Fetch recorded friend answers and creator answers in parallel
        const [answersRes, creatorAnsMap] = await Promise.all([
          supabaseAdmin
            .from("friend_answers")
            .select("question_id, answer, is_correct")
            .eq("session_id", sessionId),
          getCreatorAnswersForTest(sessionData.test_id),
        ]);

        if (answersRes.error) {
          logSupabaseError("friend_answers.select", answersRes.error);
        }

        const reconstructedGuesses: Record<string, GuessResult> = {};
        (answersRes.data || []).forEach((fa) => {
          const question = getQuestionById(fa.question_id);
          reconstructedGuesses[fa.question_id] = {
            questionId: fa.question_id,
            guessedAnswer: fa.answer,
            creatorAnswer: creatorAnsMap[fa.question_id] || "",
            isCorrect: fa.is_correct,
            isFinal: question?.isFinal ?? false,
          };
        });

        const session: FriendSessionState = {
          id: sessionData.id,
          testId: sessionData.test_id,
          friendName: sessionData.friend_name,
          startedAt: sessionData.created_at,
          completedAt: sessionData.completed_at,
          currentQuestionIndex: Object.keys(reconstructedGuesses).length,
          guesses: reconstructedGuesses,
        };

        store.sessions.set(sessionId, session);
        return session;
      }
    } catch (err) {
      logSupabaseError("getFriendSession catch", err);
    }
  }

  return null;
}

export async function submitGuess(
  sessionId: string,
  testId: string,
  questionId: string,
  guessedAnswer: string,
  verificationToken?: string
): Promise<{ result: GuessResult | null; error?: string }> {
  let creatorAnswer: string | null = null;

  // Ultra-fast path: If verificationToken is provided, decrypt in 0.05ms (0 DB calls!)
  if (verificationToken) {
    const decryptedAnswers = decryptVerificationToken(verificationToken);
    if (decryptedAnswers && decryptedAnswers[questionId]) {
      creatorAnswer = decryptedAnswers[questionId];
    }
  }

  // Fallback to cache / DB if token not present
  if (!creatorAnswer) {
    creatorAnswer = await getCreatorAnswer(testId, questionId);
  }

  if (!creatorAnswer) {
    return { result: null, error: "Question not found for this test" };
  }

  const question = getQuestionById(questionId);
  const isCorrect = creatorAnswer.trim().toLowerCase() === guessedAnswer.trim().toLowerCase();
  const guessResult: GuessResult = {
    questionId,
    guessedAnswer,
    creatorAnswer,
    isCorrect,
    isFinal: question?.isFinal ?? false,
  };

  // Instant in-memory session update if active in current node
  const session = store.sessions.get(sessionId);
  if (session) {
    session.guesses[questionId] = guessResult;
    session.currentQuestionIndex += 1;
    store.sessions.set(sessionId, session);
  }

  // Background non-blocking persistence to Supabase (never stall the user!)
  if (isSupabaseConfigured && supabaseAdmin && sessionId) {
    Promise.resolve(
      supabaseAdmin.from("friend_answers").insert({
        session_id: sessionId,
        question_id: questionId,
        answer: guessedAnswer,
        is_correct: isCorrect,
      })
    ).then(({ error }) => {
      if (error) logSupabaseError("friend_answers.insert", error);
    }).catch((err: unknown) => {
      logSupabaseError("friend_answers.insert catch", err);
    });
  }

  return { result: guessResult };
}

export async function completeFriendSession(
  sessionId: string,
  clientGuesses?: Record<string, GuessResult>,
  paramTestId?: string,
  paramFriendName?: string
): Promise<{ report: ScoreReport | null; session: FriendSessionState | null; error?: string }> {
  let session = store.sessions.get(sessionId);
  let guesses = clientGuesses || session?.guesses;

  // Fallback to DB if guesses not in memory or payload
  if (!guesses || Object.keys(guesses).length === 0) {
    const fetchedSession = await getFriendSession(sessionId);
    if (fetchedSession) {
      session = fetchedSession;
      guesses = fetchedSession.guesses;
    }
  }

  if (!guesses || Object.keys(guesses).length === 0) {
    return { report: null, session: null, error: "Session or guesses not found" };
  }

  const finalTestId = paramTestId || session?.testId || "";
  const finalFriendName = paramFriendName || session?.friendName || "Friend";

  const meta = finalTestId ? await getTestMeta(finalTestId) : null;
  const creatorName = meta?.creatorName || "Your friend";
  const report = calculateScoreReport(guesses, creatorName);

  const completedAt = new Date().toISOString();

  if (!session) {
    session = {
      id: sessionId,
      testId: finalTestId,
      friendName: finalFriendName,
      startedAt: completedAt,
      completedAt,
      currentQuestionIndex: Object.keys(guesses).length,
      guesses,
    };
  } else {
    session.testId = finalTestId || session.testId;
    session.friendName = finalFriendName;
    session.completedAt = completedAt;
  }

  session.finalScore = {
    correctCount: report.correctCount,
    totalQuestions: report.totalQuestions,
    percentage: report.percentage,
    tier: report.tier,
    biggestMiss: report.biggestMiss,
  };

  store.sessions.set(sessionId, session);

  if (isSupabaseConfigured && supabaseAdmin && finalTestId) {
    const client = supabaseAdmin;
    // Upsert friend_session first so foreign key constraint on results is 100% satisfied
    Promise.resolve(
      client.from("friend_sessions").upsert({
        id: sessionId,
        test_id: finalTestId,
        friend_name: finalFriendName,
        completed_at: completedAt,
      })
    )
      .then(() => {
        return client.from("results").insert({
          session_id: sessionId,
          test_id: finalTestId,
          correct_count: report.correctCount,
          total_questions: report.totalQuestions,
          score_percentage: report.percentage,
        });
      })
      .then(({ error }: { error?: unknown } = {}) => {
        if (error) logSupabaseError("results.insert after upsert", error);
      })
      .catch((err: unknown) => {
        logSupabaseError("completeFriendSession supabase write catch", err);
      });
  }

  return { report, session };
}

// ==========================================
// TEST LEADERBOARD (WHO KNOWS YOU BETTER)
// ==========================================

export async function getTestLeaderboard(testId: string): Promise<LeaderboardEntry[]> {
  try {
    const entries: LeaderboardEntry[] = [];

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("results")
        .select(`
          id,
          session_id,
          test_id,
          score_percentage,
          correct_count,
          total_questions,
          created_at,
          friend_sessions (
            friend_name
          )
        `)
        .eq("test_id", testId)
        .order("score_percentage", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) {
        logSupabaseError("results.select leaderboard", error);
      } else if (data && data.length > 0) {
        data.forEach((row) => {
          const fs = Array.isArray(row.friend_sessions)
            ? row.friend_sessions[0]
            : row.friend_sessions;
          const friendName = fs?.friend_name || store.sessions.get(row.session_id)?.friendName || "Anonymous Friend";
          entries.push({
            id: row.id,
            sessionId: row.session_id,
            friendName,
            scorePercentage: row.score_percentage,
            correctCount: row.correct_count,
            totalQuestions: row.total_questions,
            createdAt: row.created_at,
          });
        });
      }
    }

    // Merge in-memory sessions for instant local reactivity
    for (const session of store.sessions.values()) {
      if (session.testId === testId && session.finalScore) {
        const alreadyIn = entries.some((e) => e.sessionId === session.id);
        if (!alreadyIn) {
          entries.push({
            id: session.id,
            sessionId: session.id,
            friendName: session.friendName || "Anonymous Friend",
            scorePercentage: session.finalScore.percentage,
            correctCount: session.finalScore.correctCount,
            totalQuestions: session.finalScore.totalQuestions,
            createdAt: session.completedAt || session.startedAt,
          });
        }
      }
    }

    return entries.sort((a, b) => b.scorePercentage - a.scorePercentage);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

