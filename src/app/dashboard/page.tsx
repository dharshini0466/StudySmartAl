'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Target, Map, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { collection, query } from 'firebase/firestore';
import { useMemo } from 'react';
import type { HistoryItem, QuizResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function StatCard({ icon, title, value, isLoading }: { icon: React.ReactNode, title: string, value: string | number, isLoading?: boolean }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="bg-muted p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userName = user?.displayName?.split(' ')[0] || "StudySmart User";

  const contentHistoryQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(collection(firestore, `users/${user.uid}/content_history`));
  }, [firestore, user?.uid]);

  const quizResultsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(collection(firestore, `users/${user.uid}/quiz_results`));
  }, [firestore, user?.uid]);

  const { data: contentHistory, isLoading: isLoadingHistory } = useCollection<HistoryItem>(contentHistoryQuery);
  const { data: quizResults, isLoading: isLoadingQuizzes } = useCollection<QuizResult>(quizResultsQuery);

  const stats = useMemo(() => {
    const activeModules = contentHistory?.length ?? 0;
    
    const quizzesTaken = quizResults?.length ?? 0;
    
    let masteryRate = 0;
    if (quizResults && quizzesTaken > 0) {
      const totalScore = quizResults.reduce((acc, result) => acc + result.score, 0);
      const totalPossibleScore = quizzesTaken * 5; // Assuming each quiz has 5 questions
      masteryRate = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
    }

    return {
      activeModules,
      masteryRate,
      quizzesTaken
    };
  }, [contentHistory, quizResults]);

  const isLoadingStats = isLoadingHistory || isLoadingQuizzes;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Focus on Mastery, {userName}.</h1>
        <p className="text-muted-foreground">Your learning momentum is at an all-time high.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          icon={<BookOpen className="h-6 w-6 text-primary"/>} 
          title="ACTIVE MODULES" 
          value={stats.activeModules} 
          isLoading={isLoadingStats}
        />
        <StatCard 
          icon={<Target className="h-6 w-6 text-green-500"/>} 
          title="MASTERY RATE" 
          value={`${stats.masteryRate}%`} 
          isLoading={isLoadingStats}
        />
        <StatCard 
          icon={<ClipboardCheck className="h-6 w-6 text-red-500"/>} 
          title="QUIZZES TAKEN" 
          value={stats.quizzesTaken} 
          isLoading={isLoadingStats}
        />
      </div>

      <Card className="w-full bg-primary text-primary-foreground">
        <CardContent className="p-8 flex flex-col items-start gap-4">
          <div className="bg-primary-foreground/20 p-3 rounded-lg">
            <Map className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Next Milestone Recommendation</h2>
          <p className="max-w-2xl">
            Based on your work in Quantum Physics, we recommend Forging a
            Roadmap for "Intro to Quantum Entanglement" to bridge your current
            knowledge gap.
          </p>
          <Link href="/dashboard/forging-room">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Generate Roadmap &rarr;
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
