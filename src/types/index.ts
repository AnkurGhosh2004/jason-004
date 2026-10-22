export type QuestionCategory = 'funny' | 'suspicious' | 'personal' | 'savage' | 'final_expose';

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options: string[];
  difficulty: number;
  isFinal: boolean;
  order: number;
}

export interface CreatorAnswer {
  questionId: string;
  answer: string;
}

export interface TestSession {
  id: string; // Public unique random string like 7xK92LmQ
  creatorName: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'completed';
  questionCount: number;
  questionIds: string[];
  creatorAnswers: Record<string, string>; // questionId -> answer
}

export interface FriendGuessSubmission {
  sessionId: string;
  questionId: string;
  guessedAnswer: string;
}

export interface GuessResult {
  questionId: string;
  guessedAnswer: string;
  creatorAnswer: string;
  isCorrect: boolean;
  isFinal: boolean;
}

export interface ResultTier {
  minScore: number;
  maxScore: number;
  badge: string;
  title: string;
  description: string;
  reactionEmoji: string;
}

export interface FriendSessionState {
  id: string;
  testId: string;
  friendName?: string;
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
  guesses: Record<string, GuessResult>; // questionId -> result
  finalScore?: {
    correctCount: number;
    totalQuestions: number;
    percentage: number;
    tier: ResultTier;
    biggestMiss?: {
      questionText: string;
      guessedAnswer: string;
      creatorAnswer: string;
      comment: string;
    };
  };
}

export interface PublicTestMeta {
  id: string;
  creatorName: string;
  questionCount: number;
  questions: Omit<Question, 'creatorAnswer'>[];
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

export interface LeaderboardEntry {
  id: string;
  sessionId: string;
  friendName: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  createdAt: string;
}
