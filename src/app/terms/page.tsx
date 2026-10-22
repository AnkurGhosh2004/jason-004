import { Metadata } from "next";
import { FileText, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | LIELOOP",
  description: "LIELOOP terms of service — entertainment purposes, fair use, and community guidelines.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>TERMS OF SERVICE</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Terms of Service
        </h1>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <p>
            Welcome to LIELOOP. By creating, sharing, or taking a Lie Loop test, you agree to these friendly terms.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-pink-400" />
              1. Entertainment Purpose
            </h3>
            <p className="text-zinc-400">
              LIELOOP is a lighthearted social game designed for fun and banter between friends. It is not an actual psychological examination, legal polygraph, or relationship audit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white">2. Acceptable Conduct</h3>
            <p className="text-zinc-400">
              Do not use display names or share links containing harassment, hate speech, abusive language, or illegal materials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white">3. Service Availability</h3>
            <p className="text-zinc-400">
              We strive for 99.9% uptime and fast loading times globally. Tests expire after 30 days unless extended. We reserve the right to remove inappropriate links or abuse.
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 pt-4 border-t border-white/[0.06]">
          Have fun exposing your friend&apos;s excuses!
        </p>
      </div>
    </div>
  );
}
