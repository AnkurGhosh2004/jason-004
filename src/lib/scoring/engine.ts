import { ResultTier, GuessResult } from "@/types";
import { getQuestionById } from "@/lib/questions/data";

export const RESULT_TIERS: ResultTier[] = [
  {
    minScore: 95,
    maxScore: 100,
    badge: "FBI Agent Tier",
    title: "YOU ARE BASICALLY THEIR FBI AGENT 🕵️",
    description: "You know this person WAY too well. If they commit a crime, you're the first person the detectives should interview.",
    reactionEmoji: "🕵️",
  },
  {
    minScore: 85,
    maxScore: 94,
    badge: "Open Book Tier",
    title: "YOU CAN READ THEM LIKE A BOOK 📖",
    description: "Almost nothing gets past you. You see right through their poker face and know every tiny tell.",
    reactionEmoji: "📖",
  },
  {
    minScore: 70,
    maxScore: 84,
    badge: "Lie Detective Tier",
    title: "YOU KNOW THEM PRETTY WELL 👀",
    description: "Solid instincts! But they still managed to sneak a few sneaky little fibs right past your lie loop.",
    reactionEmoji: "👀",
  },
  {
    minScore: 50,
    maxScore: 69,
    badge: "Duped Tier",
    title: "THEY GOT AWAY WITH A LOT 💀",
    description: "You know them... but maybe not THAT well. They've been playing you like a fiddle with their classic excuses.",
    reactionEmoji: "💀",
  },
  {
    minScore: 30,
    maxScore: 49,
    badge: "Stranger Danger Tier",
    title: "WHO EVEN ARE YOU TWO? 😭",
    description: "They clearly have secrets from you. Are you sure you haven't been talking to their evil twin this whole time?",
    reactionEmoji: "😭",
  },
  {
    minScore: 0,
    maxScore: 29,
    badge: "Clueless Tier",
    title: "YOU KNOW NOTHING. ABSOLUTELY NOTHING. 💀",
    description: "Time to reconsider this friendship. You got completely bamboozled across the entire lie loop.",
    reactionEmoji: "🤡",
  },
];

export function getTierForScore(percentage: number): ResultTier {
  return (
    RESULT_TIERS.find(
      (tier) => percentage >= tier.minScore && percentage <= tier.maxScore
    ) || RESULT_TIERS[RESULT_TIERS.length - 1]
  );
}

export interface ScoreReport {
  correctCount: number;
  totalQuestions: number;
  wrongCount: number;
  percentage: number;
  tier: ResultTier;
  biggestMiss?: {
    questionId: string;
    questionText: string;
    guessedAnswer: string;
    creatorAnswer: string;
    comment: string;
  };
}

export function calculateScoreReport(
  guesses: Record<string, GuessResult>,
  creatorName: string = "Your friend"
): ScoreReport {
  const guessList = Object.values(guesses);
  const totalQuestions = guessList.length;
  const correctCount = guessList.filter((g) => g.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const tier = getTierForScore(percentage);

  // Find biggest miss (preference to high difficulty or final question miss)
  const misses = guessList.filter((g) => !g.isCorrect);
  let biggestMiss: ScoreReport["biggestMiss"] = undefined;

  if (misses.length > 0) {
    // Check if missed final question first, otherwise highest difficulty
    const finalMiss = misses.find((m) => m.isFinal) || misses[misses.length - 1];
    const qData = getQuestionById(finalMiss.questionId);

    const funnyComments = [
      `You gave ${creatorName} way too much credit. They fooled you completely! 💀`,
      `You thought you had them pinned down, but ${creatorName} took the deceptive exit.`,
      `Classic illusion. ${creatorName} never even hesitated to lie about this one.`,
      `You thought they were innocent. Reality had other plans!`,
    ];
    const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];

    biggestMiss = {
      questionId: finalMiss.questionId,
      questionText: qData ? qData.text : "Their biggest secret lie",
      guessedAnswer: finalMiss.guessedAnswer,
      creatorAnswer: finalMiss.creatorAnswer,
      comment: randomComment,
    };
  }

  return {
    correctCount,
    totalQuestions,
    wrongCount,
    percentage,
    tier,
    biggestMiss,
  };
}
