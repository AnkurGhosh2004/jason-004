import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestMeta, getTestLeaderboard } from "@/lib/db";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LeaderboardPageProps {
  params: Promise<{ testId: string }>;
}

export async function generateMetadata({ params }: LeaderboardPageProps): Promise<Metadata> {
  const { testId } = await params;
  const test = await getTestMeta(testId);
  const name = test?.creatorName || "Friend";

  return {
    title: `${name}'s LieLoop Leaderboard 🏆 | LieLoop`,
    description: `See who knows ${name} best on LieLoop! Check the live rankings.`,
  };
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const { testId } = await params;
  const test = await getTestMeta(testId);

  if (!test) {
    notFound();
  }

  const entries = await getTestLeaderboard(testId);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
      <LeaderboardView
        testId={testId}
        creatorName={test.creatorName}
        initialEntries={entries}
      />
    </div>
  );
}
