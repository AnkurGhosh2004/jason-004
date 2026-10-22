"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { playTapSound } from "@/lib/sound/effects";

export function HowItWorks() {
  const steps = [
    {
      num: 1,
      circleBg: "bg-[#FFCC00] text-[#111111]",
      title: "You answer",
      desc: "Answer questions honestly about yourself.",
      iconEmoji: "📋",
      iconDetail: "✏️",
    },
    {
      num: 2,
      circleBg: "bg-[#FF2B2B] text-white",
      title: "Send the link",
      desc: "Get a private link and send it to your friend.",
      iconEmoji: "✈️",
      iconDetail: null,
    },
    {
      num: 3,
      circleBg: "bg-[#FFCC00] text-[#111111]",
      title: "They guess",
      desc: "Your friend predicts every answer.",
      iconEmoji: "👥",
      iconDetail: null,
    },
  ];

  return (
    <section id="how-it-works" className="py-8 px-4 max-w-md mx-auto w-full">
      {/* Top Header with Logo & Red Arc Doodles */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-black text-[#111111]">
          Lie<span className="text-[#FF2B2B]">Loop</span>
        </span>

        {/* Red curved doodle strokes )) */}
        <div className="text-[#FF2B2B] text-2xl font-black select-none tracking-tighter">
          ))
        </div>
      </div>

      {/* Main Title: (( How It Works */}
      <div className="text-center mb-8 relative">
        {/* Yellow curved doodles (( on left */}
        <div className="absolute top-1 left-2 sm:left-6 text-amber-400 text-2xl font-black select-none tracking-tighter">
          ((
        </div>

        <h2 className="text-4xl font-black text-[#111111] tracking-tight mb-1">
          How It <span className="text-[#FF2B2B]">Works</span>
        </h2>
        <p className="text-xs sm:text-sm font-bold text-[#6B7280]">
          A simple 3-step game.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="space-y-3.5 mb-8">
        {steps.map((s, idx) => {
          return (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#EBE5D8] shadow-2xs flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                {/* Number Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs ${s.circleBg}`}
                >
                  {s.num}
                </div>

                {/* Step Details */}
                <div>
                  <h3 className="text-sm font-black text-[#111111] mb-0.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-semibold leading-relaxed max-w-[210px]">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Graphic Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EF] border border-[#EBE5D8] flex items-center justify-center text-2xl shrink-0 shadow-2xs relative">
                <span>{s.iconEmoji}</span>
                {s.iconDetail && (
                  <span className="absolute -bottom-1 -right-1 text-sm">
                    {s.iconDetail}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Doodle Callout Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Link
          href="/create"
          onClick={() => playTapSound()}
          className="relative bg-[#FFF0A8] hover:bg-[#FFE885] active:scale-98 rounded-2xl p-4.5 text-center overflow-hidden border border-[#FFE082] block transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          {/* Hand-drawn corner doodle marks */}
          <span className="absolute top-1 left-2 text-[#111111] font-black text-xs select-none">
            ~
          </span>
          <span className="absolute top-1 right-2 text-[#111111] font-black text-xs select-none">
            `
          </span>
          <span className="absolute bottom-1 left-2 text-[#111111] font-black text-xs select-none">
            (
          </span>
          <span className="absolute bottom-1 right-2 text-[#111111] font-black text-xs select-none">
            )
          </span>

          <span className="text-sm font-black text-[#111111] tracking-tight">
            Let&apos;s see who knows you better. 👀
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
