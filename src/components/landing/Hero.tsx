"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { playTapSound } from "@/lib/sound/effects";

export function Hero() {
  return (
    <section className="relative pt-4 pb-10 px-4 flex flex-col items-center text-center max-w-md mx-auto w-full">
      {/* Playful Floating Doodles around Hero */}
      <div className="absolute top-6 left-5 text-amber-400 text-xl select-none pointer-events-none animate-pulse">
        ⭐
      </div>
      <div className="absolute top-20 right-6 text-[#FF2B2B] text-xl select-none pointer-events-none">
        ❤️
      </div>
      <div className="absolute top-52 right-4 text-[#FF2B2B] text-3xl font-black select-none pointer-events-none">
        ❓
      </div>
      <div className="absolute top-68 left-6 text-amber-400 text-xl select-none pointer-events-none">
        ⭐
      </div>

      {/* Pill Badge: ✨ A fun friend quiz ✨ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF4CC] border border-[#FFE58F] text-[#8A5800] text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span>A fun friend quiz</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
      </motion.div>

      {/* Main Brand Title with Doodle over 'i' */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative inline-block mb-1"
      >
        {/* Cute red mini character/blob doodle sitting on the 'i' */}
        <div className="absolute -top-3.5 left-[4.8rem] sm:left-[5.8rem] text-sm select-none pointer-events-none transform -rotate-12 animate-bounce">
          🍎
        </div>

        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-[#111111] leading-none">
          Lie<span className="text-[#FF2B2B]">Loop</span>
        </h1>
      </motion.div>

      {/* Hero Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mb-2.5 flex items-center justify-center gap-1.5"
      >
        <span>Think you know them? Prove it.</span>
        <span>👀</span>
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-xs sm:text-sm text-[#4B5563] max-w-xs mx-auto leading-relaxed mb-6 font-semibold"
      >
        They answer honestly.
        <br />
        You guess what they said.
        <br />
        Let&apos;s see how well you actually know them.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 w-full max-w-xs mb-8"
      >
        {/* Red Primary Button: Create Your Test → */}
        <Link
          href="/create"
          onClick={() => playTapSound()}
          className="w-full py-4 px-6 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-red-500/25 active:scale-98 transition-all cursor-pointer"
        >
          <span>Create Your Test</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>

        {/* White Pill Button: How It Works */}
        <a
          href="#how-it-works"
          onClick={() => playTapSound()}
          className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-[#FAF7EF] border border-[#EBE5D8] text-xs font-black tracking-wide transition-all cursor-pointer shadow-xs"
        >
          <span className="text-[#111111]">How It</span>{" "}
          <span className="text-[#FF2B2B]">Works</span>
        </a>
      </motion.div>

      {/* Character Image & Comic Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="relative w-full max-w-xs mx-auto mb-6"
      >
        {/* Floating Comic Speech Bubble: BESTIES? OR JUST GUESSING? */}
        <div className="absolute -top-5 -left-3 z-20 bg-white border-2 border-[#111111] rounded-2xl px-3.5 py-1.5 shadow-md -rotate-12 transform">
          <p className="text-[11px] font-black text-[#111111] uppercase tracking-wider leading-tight text-center">
            BESTIES?
            <br />
            OR JUST
            <br />
            GUESSING?
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 right-4 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#111111] transform rotate-45" />
        </div>

        {/* Character Sticker Illustration */}
        <div className="relative w-72 h-72 mx-auto rounded-3xl overflow-hidden bg-transparent">
          <Image
            src="/images/besties.jpg"
            alt="Best friends illustration"
            fill
            priority
            sizes="(max-width: 768px) 288px, 288px"
            className="object-contain"
          />
        </div>
      </motion.div>

      {/* Viral Pill Ticker: Circle avatars + text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EBE5D8] shadow-xs"
      >
        <div className="flex -space-x-1.5 overflow-hidden">
          <span className="inline-block w-5 h-5 rounded-full bg-amber-400 text-[10px] flex items-center justify-center font-bold text-white border border-white">
            👱‍♀️
          </span>
          <span className="inline-block w-5 h-5 rounded-full bg-rose-400 text-[10px] flex items-center justify-center font-bold text-white border border-white">
            👩
          </span>
          <span className="inline-block w-5 h-5 rounded-full bg-purple-400 text-[10px] flex items-center justify-center font-bold text-white border border-white">
            👧
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#4B5563]">
          Could you predict your friend&apos;s answers? 👀
        </span>
      </motion.div>
    </section>
  );
}
