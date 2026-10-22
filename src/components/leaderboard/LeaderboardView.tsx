"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Crown, 
  Medal, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  MessageCircle, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { LeaderboardEntry } from "@/types";
import { playTapSound } from "@/lib/sound/effects";

interface LeaderboardViewProps {
  testId: string;
  creatorName: string;
  initialEntries: LeaderboardEntry[];
}

export function LeaderboardView({
  testId,
  creatorName,
  initialEntries,
}: LeaderboardViewProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const testUrl = typeof window !== "undefined"
    ? `${window.location.origin}/test/${testId}`
    : `/test/${testId}`;

  const handleRefresh = async () => {
    playTapSound();
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/tests/${testId}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        if (data.leaderboard) {
          setEntries(data.leaderboard);
        }
      }
    } catch (e) {
      console.error("Refresh error:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyLink = async () => {
    playTapSound();
    let copiedSuccess = false;

    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(testUrl);
        copiedSuccess = true;
      } catch {
        copiedSuccess = false;
      }
    }

    if (!copiedSuccess && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = testUrl;
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
    const text = `Think you know ${creatorName}? 👀\nSee if you can beat the leaderboard here:\n${testUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <Link
          href={`/test/${testId}`}
          onClick={() => playTapSound()}
          className="p-1 -ml-1 text-[#111111] hover:text-[#FF2B2B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
        </Link>
        <span className="text-xl font-black text-[#111111]">
          Lie<span className="text-[#FF2B2B]">Loop</span>
        </span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer"
          title="Refresh scores"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#FF2B2B]" : ""}`} />
        </button>
      </div>

      {/* Hero Badge */}
      <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF5D6] border border-[#FFE58F] text-[#B45309] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span>Who Knows Them Best</span>
        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-[#111111] tracking-tight flex items-center justify-center gap-1.5">
          <span>{creatorName}&apos;s Leaderboard</span>
          <span>🏆</span>
        </h1>
        <p className="text-xs text-[#6B7280] font-semibold mt-1">
          Rankings of all friends who dared to take the test.
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="w-full space-y-3 mb-6">
        {entries.length === 0 ? (
          <div className="w-full bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-3 text-2xl">
              💌
            </div>
            <h2 className="text-base font-black text-[#111111] mb-1">
              No friend scores yet!
            </h2>
            <p className="text-xs text-[#6B7280] font-medium leading-relaxed mb-5">
              Share the quiz with your friends to see who ranks #1 and exposes your lies best.
            </p>
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        ) : (
          entries.map((entry, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={entry.id || idx}
                className={`w-full rounded-2xl p-4 border flex items-center justify-between gap-3 shadow-2xs transition-all ${
                  isFirst
                    ? "bg-[#FFFDF5] border-[#FDE68A] ring-2 ring-amber-200"
                    : "bg-white border-[#EBE5D8]"
                }`}
              >
                {/* Left: Rank & Avatar/Name */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-center w-8 h-8 shrink-0">
                    {isFirst ? (
                      <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs">
                        <Crown className="w-4 h-4 fill-amber-400 stroke-amber-600" />
                      </div>
                    ) : isSecond ? (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                        <Medal className="w-3.5 h-3.5 fill-slate-300 stroke-slate-600" />
                      </div>
                    ) : isThird ? (
                      <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                        <Medal className="w-3.5 h-3.5 fill-amber-200 stroke-amber-700" />
                      </div>
                    ) : (
                      <span className="text-xs font-black text-[#9CA3AF]">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Name & Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-[#111111] truncate">
                        {entry.friendName}
                      </span>
                      {isFirst && (
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          BESTIE 👑
                        </span>
                      )}
                    </div>
                    <span suppressHydrationWarning className="text-[11px] text-[#6B7280] font-semibold block mt-0.5">
                      {entry.correctCount} / {entry.totalQuestions} correct
                      {entry.createdAt && ` • ${formatTime(entry.createdAt)}`}
                    </span>
                  </div>
                </div>

                {/* Right: Percentage Score Pill */}
                <div className="shrink-0 text-right">
                  <div
                    className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center justify-center ${
                      entry.scorePercentage >= 70
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : entry.scorePercentage >= 40
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-rose-50 text-[#FF2B2B] border border-rose-200"
                    }`}
                  >
                    {entry.scorePercentage}%
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 pt-2">
        {/* Row of Share & Copy Link */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="py-3 px-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share Quiz</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="py-3 px-3 rounded-full bg-white hover:bg-[#FAF7EF] border border-[#EBE5D8] text-[#111111] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            ) : (
              <Copy className="w-4 h-4 stroke-[2]" />
            )}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>

        {/* Take Test Link */}
        <Link
          href={`/test/${testId}`}
          onClick={() => playTapSound()}
          className="w-full py-3.5 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25 active:scale-98 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4 stroke-[2.5]" />
          <span>Play {creatorName}&apos;s Quiz</span>
        </Link>

        {/* Create My Own LieLoop */}
        <Link
          href="/create"
          onClick={() => playTapSound()}
          className="w-full py-3.5 rounded-full bg-[#FFD233] hover:bg-[#FFC815] text-[#18181B] font-black text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/25 active:scale-98 transition-all cursor-pointer"
        >
          <span>Create My Own LieLoop</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
