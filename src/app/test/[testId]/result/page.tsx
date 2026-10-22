import { Metadata } from "next";
import Link from "next/link";
import { getFriendSession, getTestMeta } from "@/lib/db";
import { calculateScoreReport } from "@/lib/scoring/engine";
import { ResultCard } from "@/components/results/ResultCard";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface ResultPageProps {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ session?: string }>;
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTestMeta(testId);
  const name = test?.creatorName || "Friend";

  return {
    title: `LieLoop Result for ${name} 👀 | LieLoop`,
    description: `See how well they know ${name}'s lies. Take the test or challenge your friends!`,
  };
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  const { testId } = await params;
  const { session: sessionId } = await searchParams;

  const test = await getTestMeta(testId);
  const creatorName = test?.creatorName || "Your friend";

  if (!sessionId) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-[#EBE5D8] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#111111] mb-2">No Active Result Found</h1>
          <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
            Take {creatorName}&apos;s LieLoop to unlock your personalized score card!
          </p>
          <Link
            href={`/test/${testId}`}
            className="w-full py-4 px-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <span>Take This LieLoop →</span>
          </Link>
        </div>
      </div>
    );
  }

  const session = await getFriendSession(sessionId);
  if (!session) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-[#EBE5D8] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#FF2B2B] flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#111111] mb-2">Session Expired</h1>
          <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
            Could not retrieve this game session. Please play the test to get fresh results.
          </p>
          <Link
            href={`/test/${testId}`}
            className="w-full py-4 px-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Take Test Again</span>
          </Link>
        </div>
      </div>
    );
  }

  const report = calculateScoreReport(session.guesses, creatorName);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <ResultCard
        report={report}
        creatorName={creatorName}
        friendName={session.friendName}
        testId={testId}
        sessionId={sessionId}
      />
    </div>
  );
}
