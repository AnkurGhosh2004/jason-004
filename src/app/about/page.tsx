import { Metadata } from "next";
import Link from "next/link";
import { Radar, Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About LIELOOP — The Lie Loop",
  description: "Learn why LIELOOP was created and how our viral social friend-prediction game works.",
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Radar className="w-3.5 h-3.5 text-pink-400" />
          <span>ABOUT LIELOOP</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How well do you really know your friend&apos;s lies?
        </h1>

        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            LIELOOP was built because generic personality quizzes are boring. Everyone knows whether their best friend is an introvert or extrovert. But do they know what their friend actually does when they text &quot;I&apos;m 5 minutes away&quot;?
          </p>

          <p>
            We turned everyday human fibs, social excuses, and harmless white lies into an addictive social game designed for WhatsApp, Instagram, and group chats.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-purple-500/20 my-4 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              The Core Game Principle
            </h3>
            <p className="text-xs text-zinc-400">
              The friend is <strong>never</strong> answering for themselves. They are predicting what the creator answered secretly. After every submission, the truth is exposed with a dramatic reveal!
            </p>
          </div>

          <h2 className="text-xl font-bold text-white pt-2">Zero Friction by Design</h2>
          <p>
            No email, no password, no downloads. You create a test in 60 seconds, copy the link, and send it to your friends. Anyone with the link can play immediately on mobile or desktop.
          </p>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private & Anonymous</span>
          </div>

          <Link
            href="/create"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40"
          >
            CREATE A TEST
          </Link>
        </div>
      </div>
    </div>
  );
}
