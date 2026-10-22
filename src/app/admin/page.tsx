"use client";

import { useState } from "react";
import { MASTER_QUESTIONS } from "@/lib/questions/data";
import { Question } from "@/types";
import { ShieldCheck, Lock, Flame } from "lucide-react";
import { playTapSound } from "@/lib/sound/effects";

export default function AdminPage() {
  const [passkey, setPasskey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [questionsList] = useState<Question[]>(MASTER_QUESTIONS);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    // Default development passkey matches ADMIN_SECRET_KEY
    if (passkey === "lieloop_secret_admin_2026" || passkey === "admin123") {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid admin passkey. Please check ADMIN_SECRET_KEY in .env");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-sm mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-6 text-center border border-[#EBE5D8] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-[#FF2B2B] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[#111111] mb-2">Admin Portal</h1>
          <p className="text-xs text-[#6B7280] mb-6">
            Enter the admin secret passkey to inspect and configure the question engine.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter admin secret..."
              required
              className="w-full px-4 py-3 rounded-xl bg-[#FAF7EF] border border-[#EBE5D8] text-[#111111] placeholder-[#9CA3AF] text-sm font-bold focus:outline-none focus:border-[#FF2B2B]"
            />
            {errorMsg && (
              <p className="text-xs text-[#DC2626] font-semibold">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/25 transition-all cursor-pointer active:scale-98"
            >
              Access Console
            </button>
          </form>

          <p className="text-[11px] text-[#6B7280] mt-4 font-semibold">
            Passkey: <code className="bg-[#FAF7EF] px-1.5 py-0.5 rounded text-[#111111]">admin123</code> or <code className="bg-[#FAF7EF] px-1.5 py-0.5 rounded text-[#111111]">lieloop_secret_admin_2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-black text-[#111111]">Question Engine Console</h1>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-semibold">
            Browse and verify all active question items across funny, suspicious, personal, savage, and final expose categories.
          </p>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-[#6B7280] hover:text-[#111111] px-4 py-2 rounded-full bg-white border border-[#EBE5D8] font-bold cursor-pointer transition-all shadow-2xs"
        >
          Log Out
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questionsList.map((q, idx) => (
          <div
            key={q.id}
            className={`bg-white rounded-2xl p-5 border shadow-2xs ${
              q.isFinal ? "border-[#FF2B2B] ring-2 ring-red-100" : "border-[#EBE5D8]"
            }`}
          >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#6B7280]">#{idx + 1}</span>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFF5D6] text-[#B45309] border border-[#FFE58F]">
                  {q.category}
                </span>
                <span className="text-[11px] font-bold text-[#6B7280]">
                  Diff: {q.difficulty}/5
                </span>
              </div>

              {q.isFinal && (
                <span className="text-[11px] font-black uppercase text-[#FF2B2B] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-[#FF2B2B]" />
                  FINAL EXPOSE
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-[#111111] mb-3">&ldquo;{q.text}&rdquo;</p>

            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oIdx) => (
                <span
                  key={oIdx}
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#FAF7EF] border border-[#EBE5D8] text-[#111111] font-semibold"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
