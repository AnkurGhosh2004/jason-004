"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  ArrowRight,
  Download, 
  Share2, 
  Check, 
  X, 
  BarChart2, 
  Loader2,
  Crown,
  Trophy
} from "lucide-react";
import { toPng } from "html-to-image";
import { ScoreReport } from "@/lib/scoring/engine";
import { fireCelebrationConfetti } from "@/components/ui/Confetti";
import { playTapSound, playSuccessSound } from "@/lib/sound/effects";

interface ResultCardProps {
  report: ScoreReport;
  creatorName: string;
  friendName?: string;
  testId: string;
  sessionId: string;
}

export function ResultCard({
  report,
  creatorName,
  testId,
  sessionId,
}: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = report.percentage;
    const duration = 1000;
    const stepTime = Math.max(Math.floor(duration / (end || 1)), 15);

    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
        if (report.percentage >= 70) {
          fireCelebrationConfetti();
          playSuccessSound();
        }
      } else {
        setAnimatedScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [report.percentage]);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/test/${testId}/result?session=${sessionId}`
    : `/test/${testId}/result?session=${sessionId}`;

  const downloadCardImage = async () => {
    if (!cardRef.current) return;
    playTapSound();
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: "#FAF7EF",
      });

      const link = document.createElement("a");
      link.download = `lieloop-${creatorName.toLowerCase()}-score.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    playTapSound();
    const text = `I got ${report.correctCount}/${report.totalQuestions} (${report.percentage}%) on ${creatorName}'s LieLoop! 💀\n\n${report.tier.title}\n\nCan you beat me? Try it here:\n${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `My LieLoop Score on ${creatorName}'s Test`,
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // cancelled
      }
    }

    let copiedSuccess = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copiedSuccess = true;
      } catch {
        copiedSuccess = false;
      }
    }

    if (!copiedSuccess && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        copiedSuccess = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        copiedSuccess = false;
      }
    }

    if (copiedSuccess) {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2500);
    }
  };

  // SVG Circular Ring Calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Nav */}
      <div className="w-full flex items-center justify-between mb-4">
        <Link href="/" className="p-1 -ml-1 text-[#111827] hover:text-[#FF3838]">
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <span className="text-xl font-black text-[#111827]">
          Lie<span className="text-[#FF3838]">Loop</span>
        </span>
        <div className="w-5" />
      </div>

      {/* EXPORTABLE CARD CONTAINER */}
      <div ref={cardRef} className="w-full bg-[#FAF7EF] p-2 flex flex-col items-center text-center">
        {/* Title with Crown Doodle */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <h1 className="text-xl font-black text-[#111827] tracking-tight uppercase">
            LIELOOP COMPLETE
          </h1>
          <Crown className="w-5 h-5 text-amber-500 fill-amber-400 -rotate-12" />
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-5">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#F3EDE1"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#FF3838"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-[#111827] tracking-tight">
              {animatedScore}%
            </span>
          </div>
        </div>

        {/* Tier Title & Ratio */}
        <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight mb-1">
          {report.tier.title}
        </h2>
        <p className="text-xs font-semibold text-[#6B7280] mb-5">
          {report.correctCount} / {report.totalQuestions} correct
        </p>

        {/* 3 Stats Badges in a Row */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
          {/* Correct */}
          <div className="bg-white rounded-2xl p-2.5 border border-[#E5DFD3] shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{report.correctCount}</span>
            </div>
            <span className="text-[10px] font-bold text-[#6B7280] uppercase mt-0.5">
              Correct
            </span>
          </div>

          {/* Wrong */}
          <div className="bg-white rounded-2xl p-2.5 border border-[#E5DFD3] shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[#FF3838] font-black text-sm">
              <X className="w-4 h-4 stroke-[3]" />
              <span>{report.wrongCount}</span>
            </div>
            <span className="text-[10px] font-bold text-[#6B7280] uppercase mt-0.5">
              Wrong
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl p-2.5 border border-[#E5DFD3] shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
              <BarChart2 className="w-4 h-4 stroke-[2.5]" />
              <span>{report.percentage}%</span>
            </div>
            <span className="text-[10px] font-bold text-[#6B7280] uppercase mt-0.5">
              Accuracy
            </span>
          </div>
        </div>

        {/* Your Biggest Miss Card */}
        {report.biggestMiss && (
          <div className="w-full bg-[#FFFBF0] rounded-2xl p-3.5 border border-[#FDE68A] text-left flex items-start gap-3 mb-6 shadow-2xs">
            <span className="text-2xl mt-0.5 select-none">😮</span>
            <div className="flex-1">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-1">
                Your Biggest Miss
              </h3>
              <p className="text-xs font-semibold text-[#4B5563] leading-snug">
                &ldquo;You thought they were honest about &lsquo;{report.biggestMiss.questionText}&rsquo;. They were NOT. 💀&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS (Matching Screen 10) */}
      <div className="w-full space-y-3 mb-4">
        {/* Row of Share & Download */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {/* Red Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="py-3.5 px-4 rounded-full bg-[#FF3838] hover:bg-[#EE2B2B] text-white font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>{copiedResult ? "Copied!" : "Share My Score"}</span>
          </button>

          {/* White Download Button */}
          <button
            type="button"
            disabled={downloading}
            onClick={downloadCardImage}
            className="py-3.5 px-4 rounded-full bg-white hover:bg-[#FAF6EC] border border-[#E5DFD3] text-[#374151] font-extrabold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FF3838]" />
            ) : (
              <Download className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Download</span>
          </button>
        </div>
        {/* See Friends Leaderboard */}
        <Link
          href={`/test/${testId}/leaderboard`}
          onClick={() => playTapSound()}
          className="w-full py-3.5 rounded-full bg-white hover:bg-[#FAF7EF] border border-[#EBE5D8] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>See Friends Leaderboard 🏆</span>
        </Link>
        {/* Big Yellow Viral CTA Button: Create My Own LieLoop → */}
        <Link
          href="/create"
          onClick={() => playTapSound()}
          className="w-full py-4 rounded-full bg-[#FFD233] hover:bg-[#FFC815] text-[#18181B] font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-yellow-500/25 active:scale-98 transition-all cursor-pointer"
        >
          <span>Create My Own LieLoop</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
