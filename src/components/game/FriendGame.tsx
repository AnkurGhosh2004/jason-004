"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  X, 
  Loader2
} from "lucide-react";
import { PublicTestMeta, GuessResult } from "@/types";
import { formatQuestionForFriend } from "@/lib/questions/data";
import { playTapSound, playSuccessSound, playFailSound } from "@/lib/sound/effects";
import { fireConfetti } from "@/components/ui/Confetti";

interface FriendGameProps {
  test: PublicTestMeta;
  verificationToken?: string;
}

export function FriendGame({ test, verificationToken }: FriendGameProps) {
  const router = useRouter();

  const [gameState, setGameState] = useState<"welcome" | "playing" | "submitting">("welcome");
  const [friendName, setFriendName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recordedGuesses, setRecordedGuesses] = useState<Record<string, GuessResult>>({});

  // Current question reveal state
  const [currentReveal, setCurrentReveal] = useState<GuessResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const currentQ = test.questions[currentIndex];
  const totalQuestions = test.questions.length;

  // Initialize Session: Instant optimistic start (0ms waiting!)
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setErrorMsg("");

    const safeFriendName = friendName.trim() || "Friend";
    const newSessionId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });

    setSessionId(newSessionId);
    setGameState("playing");
    setCurrentIndex(0);
    setSelectedGuess(null);
    setCurrentReveal(null);

    // Fire session creation in background (zero UI delay)
    fetch(`/api/tests/${test.id}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendName: safeFriendName, sessionId: newSessionId }),
    }).catch((err) => console.error("Session start background error:", err));
  };

  // Lock in Friend Guess with sub-second verification
  const handleLockGuess = async () => {
    if (!selectedGuess || !sessionId || !currentQ || isVerifying) return;
    playTapSound();
    setIsVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/tests/${test.id}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQ.id,
          guessedAnswer: selectedGuess,
          verificationToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.result) {
        throw new Error(data.error || "Failed to verify guess");
      }

      const result: GuessResult = data.result;
      setCurrentReveal(result);
      setRecordedGuesses((prev) => ({ ...prev, [currentQ.id]: result }));

      if (result.isCorrect) {
        playSuccessSound();
        fireConfetti(45);
      } else {
        playFailSound();
      }
    } catch (err: unknown) {
      console.error("Guess verification error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Advance to Next Question or Finalize
  const handleNextQuestion = async () => {
    playTapSound();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedGuess(null);
      setCurrentReveal(null);
    } else {
      // Completed all questions -> Finalize
      setGameState("submitting");
      try {
        const res = await fetch(`/api/tests/${test.id}/finish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            testId: test.id,
            friendName: friendName.trim() || "Friend",
            guesses: recordedGuesses,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.report) {
          throw new Error(data.error || "Failed to compute results");
        }

        router.push(`/test/${test.id}/result?session=${sessionId}`);
      } catch (err) {
        console.error("Finish session error:", err);
        router.push(`/test/${test.id}/result?session=${sessionId}`);
      }
    }
  };

  const getCategoryBadgeText = (category: string) => {
    switch (category) {
      case "funny":
        return "FUNNY";
      case "suspicious":
        return "SUSPICIOUS";
      case "personal":
        return "PERSONAL";
      case "savage":
        return "SAVAGE";
      case "final_expose":
        return "FINAL EXPOSE";
      default:
        return "QUESTION";
    }
  };

  // ==========================================
  // SCREEN 6: FRIEND LANDING (/test/[id])
  // ==========================================
  if (gameState === "welcome") {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col items-center text-center">
        {/* Brand Header */}
        <div className="mb-3">
          <span className="text-2xl font-black text-[#111111]">
            Lie<span className="text-[#FF2B2B]">Loop</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-1">
          {test.creatorName}&apos;s{" "}
          <span className="text-[#FF2B2B]">LieLoop 👀</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] font-semibold mb-4">
          How well do you REALLY know them?
        </p>

        {/* Category Pills Row */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-4">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF5D6] text-[#B45309]">
            😂 Funny
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF5D6] text-[#B45309]">
            🤨 Suspicious
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFE8D6] text-[#C2410C]">
            👀 Personal
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48]">
            🔥 Savage
          </span>
        </div>

        {/* Character Illustration with Doodles */}
        <div className="relative w-52 h-52 mx-auto mb-5">
          <div className="absolute -top-2 left-2 text-amber-400 text-lg">⭐</div>
          <div className="absolute top-1 right-2 text-[#FF2B2B] text-2xl font-black">❓</div>
          <div className="absolute bottom-4 left-0 text-[#FF2B2B] text-lg">❤️</div>
          <div className="absolute bottom-2 right-2 text-amber-400 text-lg">✨</div>

          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/images/single-girl.jpg"
              alt="Friend avatar"
              fill
              priority
              sizes="(max-width: 768px) 208px, 208px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Start Game Form */}
        <form onSubmit={handleStartGame} className="w-full space-y-3.5">
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={25}
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#EBE5D8] text-[#111111] placeholder-[#9CA3AF] text-sm font-semibold text-center focus:outline-none focus:border-[#FF2B2B] shadow-2xs"
          />

          {errorMsg && (
            <p className="text-xs text-[#DC2626] font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25 active:scale-98 transition-all cursor-pointer"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Let&apos;s Find Out</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Submitting Loader
  if (gameState === "submitting") {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 text-[#FF2B2B] animate-spin mx-auto mb-3" />
        <h2 className="text-xl font-black text-[#111111] mb-1">CALCULATING YOUR SCORE...</h2>
        <p className="text-xs text-[#6B7280]">Comparing against {test.creatorName}&apos;s answers...</p>
      </div>
    );
  }

  // ==========================================
  // SCREEN 8 & 9: EXACT REVEAL SCREENS (Image 4)
  // ==========================================
  if (currentReveal) {
    const isCorrect = currentReveal.isCorrect;

    return (
      <div
        className={`w-full max-w-md mx-auto px-4 py-6 flex flex-col min-h-[92vh] justify-between items-center text-center rounded-3xl ${
          isCorrect ? "bg-[#FFFDE8]" : "bg-[#FFF1F2]"
        }`}
      >
        <div className="w-full flex flex-col items-center pt-8">
          {/* Confetti Particle Doodles around the big circle */}
          <div className="relative w-full flex justify-center mb-6">
            <div className="absolute top-1 left-12 text-[#FF2B2B] text-xs">♦</div>
            <div className="absolute top-3 right-14 text-blue-500 text-xs">■</div>
            <div className="absolute -top-2 left-28 text-amber-500 text-xs">▲</div>
            <div className="absolute top-8 right-8 text-green-500 text-xs">●</div>
            <div className="absolute top-6 left-8 text-black text-xs">■</div>
            <div className="absolute -top-3 right-24 text-[#FF2B2B] text-xs">★</div>

            {/* Big 96px Circle: Green Check or Red Cross */}
            {isCorrect ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-lg shadow-green-500/25"
              >
                <Check className="w-14 h-14 stroke-[4]" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 rounded-full bg-[#FF2B2B] text-white flex items-center justify-center shadow-lg shadow-red-500/25 animate-shake"
              >
                <X className="w-14 h-14 stroke-[4]" />
              </motion.div>
            )}
          </div>

          {/* Title: YOU GOT THEM! 🔥 vs NOPE 💀 */}
          {isCorrect ? (
            <h2 className="text-2xl sm:text-3xl font-black text-[#15803D] tracking-tight mb-8">
              YOU GOT THEM! 🔥
            </h2>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-8 flex items-center justify-center gap-2">
              <span>NOPE</span>
              <span>💀</span>
            </h2>
          )}

          {/* Comparison Cards: Your guess vs Their answer */}
          <div className="w-full space-y-3 mb-6">
            {/* Row 1: Your guess */}
            <div className="w-full bg-white rounded-2xl p-4 border border-[#EBE5D8] shadow-2xs flex items-center gap-3.5 text-left">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCorrect ? "bg-[#22C55E] text-white" : "bg-[#FF2B2B] text-white"
                }`}
              >
                {isCorrect ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <X className="w-4 h-4 stroke-[3]" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6B7280] block">
                  Your guess
                </span>
                <span className="text-base font-black text-[#111111]">
                  {currentReveal.guessedAnswer}
                </span>
              </div>
            </div>

            {/* Row 2: Their answer */}
            <div className="w-full bg-white rounded-2xl p-4 border border-[#EBE5D8] shadow-2xs flex items-center gap-3.5 text-left">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCorrect ? "bg-[#22C55E] text-white" : "bg-[#FF2B2B] text-white"
                }`}
              >
                {isCorrect ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <X className="w-4 h-4 stroke-[3]" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6B7280] block">
                  Their answer
                </span>
                <span className="text-base font-black text-[#111111]">
                  {currentReveal.creatorAnswer}
                </span>
              </div>
            </div>
          </div>

          {!isCorrect && (
            <p className="text-xs font-semibold text-[#6B7280] italic mb-6">
              &ldquo;She got you.&rdquo;
            </p>
          )}
        </div>

        {/* Sunny Yellow Pill Button: Next Question → */}
        <div className="w-full pb-2">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-full py-4 rounded-full bg-[#FFC72C] hover:bg-[#EBB21C] text-[#111111] font-black text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <span>{currentIndex === totalQuestions - 1 ? "See Final Results →" : "Next Question →"}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 7: FRIEND QUESTION SCREEN
  // ==========================================
  const formattedQuestion = formatQuestionForFriend(currentQ.text, test.creatorName);
  const badgeText = getCategoryBadgeText(currentQ.category);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-[92vh] justify-between">
      <div>
        {/* Top Line: ← LieLoop */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-2xl font-black text-[#111111]">
            Lie<span className="text-[#FF2B2B]">Loop</span>
          </span>
        </div>

        {/* Red Progress Bar + 4/12 Fraction on right */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-2 rounded-full bg-[#EAE4D5] overflow-hidden">
            <motion.div
              className="h-full bg-[#FF2B2B] rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <span className="text-xs font-black text-[#222222]">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Yellow Category Pill Badge: SUSPICIOUS */}
        <div className="flex justify-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider px-6 py-1.5 rounded-full bg-[#FFCC00] text-[#111111] shadow-2xs">
            {badgeText}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-black text-[#111111] text-center leading-snug mb-3 px-3">
          {formattedQuestion}
        </h2>

        {/* Crucial Game Rule Prompt Badge: ‹‹ GUESS WHAT THEY ANSWERED 👀 ›› */}
        <div className="flex justify-center mb-5">
          <span className="text-[11px] font-black text-[#B45309] uppercase tracking-wider flex items-center gap-1">
            <span>‹‹</span>
            <span>GUESS WHAT THEY ANSWERED 👀</span>
            <span>››</span>
          </span>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 mb-6">
          {currentQ.options.map((option) => {
            const isSelected = selectedGuess === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  playTapSound();
                  setSelectedGuess(option);
                }}
                className={`w-full py-4 px-4.5 rounded-2xl text-sm font-extrabold text-left transition-colors duration-100 flex items-center justify-between cursor-pointer border-2 ${
                  isSelected
                    ? "bg-[#FFF1F1] border-[#FF2B2B] text-[#8B0000] shadow-xs"
                    : "bg-white border-[#EBE5D8] text-[#222222] hover:border-stone-400"
                }`}
              >
                <span>{option}</span>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#FF2B2B] text-white flex items-center justify-center shrink-0 ml-3">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs text-[#DC2626] font-semibold text-center mb-3">{errorMsg}</p>
        )}
      </div>

      {/* Bottom Red Pill Button: Lock My Guess → */}
      <div className="pt-2 pb-2">
        <button
          type="button"
          disabled={!selectedGuess || isVerifying}
          onClick={handleLockGuess}
          className={`w-full py-4 rounded-full font-black text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
            selectedGuess
              ? "bg-[#FF2B2B] hover:bg-[#E82020] text-white shadow-red-500/25 active:scale-98"
              : "bg-[#EAE4D5] text-[#9CA3AF] cursor-not-allowed shadow-none"
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Guess...</span>
            </>
          ) : (
            <>
              <span>Lock My Guess</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
