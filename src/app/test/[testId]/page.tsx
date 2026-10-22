import { Metadata } from "next";
import Link from "next/link";
import { getTestMeta, getTestVerificationToken } from "@/lib/db";
import { FriendGame } from "@/components/game/FriendGame";
import { AlertCircle, Clock, ArrowLeft } from "lucide-react";

interface TestPageProps {
  params: Promise<{ testId: string }>;
}

export async function generateMetadata({ params }: TestPageProps): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTestMeta(testId);

  if (!test) {
    return {
      title: "Test Not Found | LieLoop",
      description: "This LieLoop does not exist.",
    };
  }

  return {
    title: `${test.creatorName}'s LieLoop 👀 | LieLoop`,
    description: `How well do you REALLY know ${test.creatorName}? Guess their secret answers and see your LieLoop score!`,
    openGraph: {
      title: `${test.creatorName}'s LieLoop 👀`,
      description: `Think you know ${test.creatorName}? Try to predict their secret answers!`,
    },
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const { testId } = await params;
  const [test, verificationToken] = await Promise.all([
    getTestMeta(testId),
    getTestVerificationToken(testId),
  ]);

  // Error State: Test does not exist
  if (!test) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-[#EBE5D8] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#FF2B2B] flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#111111] mb-2">
            Uh oh... this LieLoop doesn&apos;t exist.
          </h1>
          <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
            The link may be mistyped or the creator hasn&apos;t finished setting it up yet.
          </p>
          <Link
            href="/"
            className="w-full py-4 px-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  // Error State: Test has expired
  if (test.isExpired) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-[#EBE5D8] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#111111] mb-2">
            This LieLoop has expired ⏳
          </h1>
          <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
            Tests expire after 30 days. Don&apos;t worry—you can create a fresh LieLoop and test your friends!
          </p>
          <Link
            href="/create"
            className="w-full py-4 px-4 rounded-full bg-[#FF2B2B] hover:bg-[#E82020] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <span>Create Your Test →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <FriendGame test={test} verificationToken={verificationToken} />
    </div>
  );
}
