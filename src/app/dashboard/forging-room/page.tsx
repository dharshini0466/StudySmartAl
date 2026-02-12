'use client';

import { useState } from 'react';
import { BookOpen, FileText, Bot, Layers, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { generateContentAction } from '@/lib/actions';
import type { ContentType, QuizData, Flashcard as FlashcardType } from '@/lib/types';
import { GeneratedContent } from '@/components/generated-content';
import { QuizModule } from '@/components/quiz-module';
import { FlashcardModule } from '@/components/flashcard-module';
import { parseFlashcards } from '@/lib/utils';

export default function ForgingRoomPage() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('Notes');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedTopic, setGeneratedTopic] = useState<string | null>(null);
  const [generatedType, setGeneratedType] = useState<ContentType | null>(null);

  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: 'Topic is required',
        description: 'Please enter a topic to generate content.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setGeneratedType(null);

    const result = await generateContentAction(topic, contentType);

    setIsLoading(false);

    if (result.error) {
      toast({
        title: 'Generation Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.content) {
      setGeneratedContent(result.content);
      setGeneratedTopic(topic);
      setGeneratedType(contentType);
      addHistoryItem({ topic, type: contentType, content: result.content });
      toast({
        title: 'Content Generated!',
        description: `Your ${contentType.toLowerCase()} on "${topic}" are ready.`,
      });
    }
  };
  
  const renderContent = () => {
    if (!generatedContent || !generatedType || !generatedTopic) return null;

    switch (generatedType) {
      case 'Notes':
      case 'Summary':
        return <GeneratedContent topic={generatedTopic} content={generatedContent} />;
      case 'MCQ':
        try {
          const quizData: QuizData = JSON.parse(generatedContent);
          return <QuizModule topic={generatedTopic} quizData={quizData} />;
        } catch (error) {
          return <p className="text-destructive">Failed to parse quiz data.</p>;
        }
      case 'Flashcards':
        const flashcards: FlashcardType[] = parseFlashcards(generatedContent);
        return <FlashcardModule topic={generatedTopic} flashcards={flashcards} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Content Forging Room</CardTitle>
          <CardDescription>Enter a topic and choose a content type to generate new learning materials.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., The French Revolution"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content-type">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value) => setContentType(value as ContentType)}
                disabled={isLoading}
              >
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select a content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Notes">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Notes
                    </div>
                  </SelectItem>
                  <SelectItem value="Summary">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Summary
                    </div>
                  </SelectItem>
                  <SelectItem value="MCQ">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" /> MCQ Quiz
                    </div>
                  </SelectItem>
                  <SelectItem value="Flashcards">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Flashcards
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading && (
         <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/5" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      )}

      {!isLoading && generatedContent && (
        <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          {renderContent()}
        </div>
      )}

       {!isLoading && !generatedContent && (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold font-headline">Your content will appear here</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Once you generate content, it will be displayed in this area.
          </p>
        </div>
      )}
    </div>
  );
}
