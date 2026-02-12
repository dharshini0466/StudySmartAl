'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Separator } from './ui/separator';
import { Flashcard as FlashcardType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  card: FlashcardType;
}

function Flashcard({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-64 w-full cursor-pointer rounded-lg [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-lg shadow-md transition-all duration-500 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-card p-4 [backface-visibility:hidden]">
          <p className="text-center text-lg font-medium">{card.term}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary p-4 text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-center">{card.definition}</p>
        </div>
      </div>
    </div>
  );
}

interface FlashcardModuleProps {
  topic: string;
  flashcards: FlashcardType[];
}

export function FlashcardModule({ topic, flashcards }: FlashcardModuleProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-area">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl capitalize">{topic}</CardTitle>
          <Button variant="outline" size="sm" onClick={handlePrint} className="no-print">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {flashcards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {flashcards.map((card, index) => (
                <Flashcard key={index} card={card} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Could not parse flashcards from the generated content.</p>
              <p>Please try a different topic or generate again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
