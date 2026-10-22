import { Metadata } from "next";
import { Shield, Clock, Lock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LIELOOP",
  description: "LIELOOP privacy policy — zero invasive tracking, no required accounts, automatic expiration.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>PRIVACY FIRST</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-sm text-zinc-300 leading-relaxed">
          At LIELOOP, we believe fun social games shouldn&apos;t require handing over personal data. We built the platform with minimal data collection and maximum transparency.
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              1. What We Collect
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong>Display Nickname:</strong> The creator name and friend nickname you choose to display on the test.</li>
              <li><strong>Quiz Responses:</strong> The selected multiple-choice answers for test scoring and reveal.</li>
              <li><strong>No Passwords or Emails:</strong> We never request email addresses, phone numbers, contact lists, or GPS location.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              2. How Long Data Is Kept
            </h3>
            <p className="text-zinc-400">
              Tests are automatically set to expire after <strong>30 days</strong>. After expiration, tests cannot be taken or viewed by new participants.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              3. Data Protection & Sharing
            </h3>
            <p className="text-zinc-400">
              We never sell your data to third parties, advertising brokers, or data aggregators. Data is used solely for the real-time execution of the Lie Loop game.
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 pt-4 border-t border-white/[0.06]">
          Last updated: October 2026. If you have any questions or would like your test deleted immediately, reach out at privacy@lieloop.app.
        </p>
      </div>
    </div>
  );
}
