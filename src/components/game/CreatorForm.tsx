"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  Share2, 
  MessageCircle, 
  Loader2,
  Trophy
} from "lucide-react";
import { Question } from "@/types";
import { getQuestionsForCount } from "@/lib/questions/data";
import { playTapSound, playSuccessSound } from "@/lib/sound/effects";
import { fireCelebrationConfetti } from "@/components/ui/Confetti";

export function CreatorForm() {
  const [step, setStep] = useState<"intro" | "questions" | "ready">("intro");
  const [creatorName, setCreatorName] = useState("Gandhi");
  const [nickname, setNickname] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(12);
  const questions: Question[] = getQuestionsForCount(questionCount);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) {
      setErrorMsg("Please enter your name 👀");
      return;
    }
    setErrorMsg("");
    playTapSound();
    setStep("questions");
    setCurrentIndex(0);
    setSelectedOption(null);
  };

  const handleSelectOption = (opt: string) => {
    playTapSound();
    setSelectedOption(opt);
  };

  const handleLockIn = async () => {
    if (!selectedOption) return;
    playTapSound();

    const currentQ = questions[currentIndex];
    const updatedAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Completed all questions -> submit to server
      setIsSubmitting(true);
      try {
        const displayName = nickname.trim() ? `${creatorName.trim()} (${nickname.trim()})` : creatorName.trim();
        const res = await fetch("/api/tests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creatorName: displayName,
            questionCount,
            creatorAnswers: updatedAnswers,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create your test");
        }

        const origin = window.location.origin;
        const testLink = `${origin}/test/${data.testId}`;
        setShareUrl(testLink);
        setStep("ready");
        playSuccessSound();
        fireCelebrationConfetti();
      } catch (err: unknown) {
        console.error("Test creation error:", err);
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCopyLink = async () => {
    playTapSound();
    let copiedSuccess = false;

    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copiedSuccess = true;
      } catch {
        copiedSuccess = false;
      }
    }

    if (!copiedSuccess && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        copiedSuccess = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copiedSuccess = false;
      }
    }

    if (copiedSuccess) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    playTapSound();
    const text = `Think you know me? 👀\nTake my LieLoop and prove it:\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNativeShare = async () => {
    playTapSound();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My LieLoop 👀",
          text: `Think you know me? 👀 Take my LieLoop and prove it:`,
          url: shareUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const currentQ = questions[currentIndex];

  // Category label mapper
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
  // SCREEN 3: CREATE TEST – NAME & SETTINGS (Image 2)
  // ==========================================
  if (step === "intro") {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-[90vh] justify-between">
        <div>
          {/* Top Line 1: ← LieLoop */}
          <div className="flex items-center gap-1.5 mb-2">
            <Link
              href="/"
              className="p-1 -ml-1 text-[#111111] hover:text-[#FF2B2B] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
            </Link>
            <span className="text-2xl font-black text-[#111111]">
              Lie<span className="text-[#FF2B2B]">Loop</span>
            </span>
          </div>

          {/* Top Line 2: ← on its own line */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-block p-1 -ml-1 text-[#111111] hover:text-[#FF2B2B] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
            </Link>
          </div>

          {/* Header Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1 flex items-center gap-1.5">
              <span>Let&apos;s expose you</span>
              <span>👀</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] font-medium leading-relaxed">
              Answer honestly. Your friend will try to predict you.
            </p>
          </div>

          <form onSubmit={handleStartQuestions} className="space-y-5">
            {/* Input 1: Your name */}
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold text-[#111111] mb-1.5">
                Your name
              </label>
              <input
                id="name-input"
                type="text"
                value={creatorName}
                onChange={(e) => {
                  setCreatorName(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="Gandhi"
                maxLength={25}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#EBE5D8] text-[#111111] placeholder-[#9CA3AF] text-sm font-bold focus:outline-none focus:border-[#FF2B2B] shadow-2xs"
              />
            </div>

            {/* Input 2: Nickname (optional) */}
            <div>
              <label htmlFor="nickname-input" className="block text-xs font-bold text-[#111111] mb-1.5">
                Nickname (optional)
              </label>
              <input
                id="nickname-input"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Anu"
                maxLength={20}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#EBE5D8] text-[#111111] placeholder-[#9CA3AF] text-sm font-medium focus:outline-none focus:border-[#FF2B2B] shadow-2xs"
              />
            </div>

            {/* Choose Number of Questions */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-2">
                Choose number of questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 12, 15].map((cnt) => {
                  const isSelected = questionCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setQuestionCount(cnt);
                      }}
                      className={`py-3.5 px-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF1F1] border-2 border-[#FF2B2B] text-[#FF2B2B]"
                          : "bg-white border border-[#EBE5D8] text-[#111111] hover:border-stone-400"
                      }`}
                    >
                      <span className={`text-xl font-black ${isSelected ? "text-[#FF2B2B]" : "text-[#111111]"}`}>
                        {cnt}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? "text-[#FF2B2B]" : "text-[#6B7280]"}`}>
                        questions
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-[#DC2626] font-semibold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25 active:scale-98 transition-all cursor-pointer mt-8"
            >
              <span>Start Answering</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 4: CREATOR QUESTION FLOW (Image 1)
  // ==========================================
  if (step === "questions" && currentQ) {
    const badgeText = getCategoryBadgeText(currentQ.category);

    return (
      <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col min-h-[92vh] justify-between">
        <div>
          {/* Top Line: ← LieLoop */}
          <div className="flex items-center gap-1.5 mb-4">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                  setSelectedOption(answers[questions[currentIndex - 1].id] || null);
                } else {
                  setStep("intro");
                }
              }}
              className="p-1 -ml-1 text-[#111111] hover:text-[#FF2B2B]"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
            </button>
            <span className="text-2xl font-black text-[#111111]">
              Lie<span className="text-[#FF2B2B]">Loop</span>
            </span>
          </div>

          {/* Red Progress Bar + 3/12 Fraction on right */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-2 rounded-full bg-[#EAE4D5] overflow-hidden">
              <motion.div
                className="h-full bg-[#FF2B2B] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-xs font-black text-[#222222]">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Yellow Category Pill Badge: FUNNY */}
          <div className="flex justify-center mb-3">
            <span className="text-xs font-black uppercase tracking-wider px-6 py-1.5 rounded-full bg-[#FFCC00] text-[#111111] shadow-2xs">
              {badgeText}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-black text-[#111111] text-center leading-snug mb-5 px-3">
            {currentQ.text}
          </h2>

          {/* Option Cards */}
          <div className="space-y-2.5 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(option)}
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

        {/* Bottom Red Pill Button: Lock It In → */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            disabled={!selectedOption || isSubmitting}
            onClick={handleLockIn}
            className={`w-full py-4 rounded-full font-black text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              selectedOption
                ? "bg-[#FF2B2B] hover:bg-[#E82020] text-white shadow-red-500/25 active:scale-98"
                : "bg-[#EAE4D5] text-[#9CA3AF] cursor-not-allowed shadow-none"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Your Test...</span>
              </>
            ) : (
              <>
                <span>Lock It In</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 5: CREATOR COMPLETION
  // ==========================================
  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col items-center text-center">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between mb-3">
        <Link href="/" className="p-1 -ml-1 text-[#111111] hover:text-[#FF2B2B]">
          <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
        </Link>
        <span className="text-2xl font-black text-[#111111]">
          Lie<span className="text-[#FF2B2B]">Loop</span>
        </span>
        <div className="w-5" />
      </div>

      {/* Character Avatar */}
      <div className="relative w-28 h-28 mx-auto mt-2 mb-3 rounded-full overflow-hidden bg-transparent">
        <Image
          src="/images/single-girl.jpg"
          alt="Avatar celebration"
          fill
          priority
          sizes="(max-width: 768px) 112px, 112px"
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mb-1 flex items-center justify-center gap-1.5">
        <span>Your Test is Ready!</span>
        <span>👀</span>
      </h2>
      <p className="text-xs sm:text-sm text-[#4B5563] font-medium mb-5 max-w-xs">
        Now send this to your friend and see if they actually know you.
      </p>

      {/* Link Card Box */}
      <div className="w-full bg-white rounded-2xl p-3.5 border border-[#EBE5D8] shadow-2xs flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-[#111111] truncate max-w-[270px]">
          {shareUrl ? shareUrl.replace(/^https?:\/\//, "") : "lieloop.com/test/..."}
        </span>
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111111] hover:bg-[#FAF7EF] transition-colors cursor-pointer shrink-0"
          title="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          ) : (
            <Copy className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>

      {/* WhatsApp Green Button */}
      <button
        onClick={handleWhatsAppShare}
        className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer mb-2.5"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>Share on WhatsApp</span>
      </button>

      {/* Share Link White Button */}
      <button
        onClick={handleNativeShare}
        className="w-full py-3.5 rounded-full bg-white hover:bg-[#FAF7EF] border border-[#EBE5D8] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mb-2.5 active:scale-98"
      >
        <Share2 className="w-4 h-4 stroke-[2.2]" />
        <span>Share Link</span>
      </button>

      {/* View Live Leaderboard Button */}
      <Link
        href={`${shareUrl}/leaderboard`}
        onClick={() => playTapSound()}
        className="w-full py-3.5 rounded-full bg-[#FFF5D6] hover:bg-[#FFEAA6] border border-[#FFE58F] text-[#B45309] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mb-6 active:scale-98"
      >
        <Trophy className="w-4 h-4 text-amber-600" />
        <span>View Friend Leaderboard 🏆</span>
      </Link>

      {/* Floating Love Letter Graphic */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <div className="w-12 h-10 rounded-xl bg-white border border-[#EBE5D8] shadow-xs flex items-center justify-center text-xl">
          💌
        </div>
        <p className="text-xs font-bold text-[#111111]">
          Waiting for your friend...
        </p>
        <p className="text-[11px] text-[#6B7280]">
          You can close this page now.
        </p>
      </div>
    </div>
  );
}
