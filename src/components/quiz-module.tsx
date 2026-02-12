'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Percent, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { QuizData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';


interface QuizModuleProps {
  topic: string;
  quizData: QuizData;
}

export function QuizModule({ topic, quizData }: QuizModuleProps) {
  const { quiz } = quizData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const firestore = useFirestore();
  const { user } = useUser();

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setIsFinished(true);

    if (user) {
      const quizResultData = {
          userId: user.uid,
          topic: topic,
          score: newScore,
          difficulty: 'medium', // This is static for now, can be dynamic later
          date: new Date().toISOString(),
      };
      const resultsCollectionRef = collection(firestore, `users/${user.uid}/quiz_results`);
      addDocumentNonBlocking(resultsCollectionRef, quizResultData);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  if (!quiz || quiz.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load the quiz. Please try generating it again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="printable-area">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle className="font-headline text-2xl capitalize">{topic} Quiz</CardTitle>
              <Button variant="outline" size="sm" onClick={handlePrint} className="no-print">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg font-semibold">{currentQuestion.question}</p>
              <RadioGroup
                value={selectedAnswers[currentQuestionIndex]}
                onValueChange={handleAnswerSelect}
                className="grid gap-4"
              >
                {currentQuestion.options.map((option, i) => (
                  <Label
                    key={i}
                    className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${i}`} />
                    <span>{option}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="no-print">
            <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]} className="ml-auto">
              {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={isFinished} onOpenChange={setIsFinished}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-center text-2xl">Quiz Completed!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You have completed the quiz on {topic}. Here are your results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10">
              <Percent className="h-12 w-12 text-primary" />
            </div>
            <p className="text-4xl font-bold">
              {((score / quiz.length) * 100).toFixed(0)}%
            </p>
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-2xl font-semibold text-green-600">{score}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-destructive">{quiz.length - score}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsFinished(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
