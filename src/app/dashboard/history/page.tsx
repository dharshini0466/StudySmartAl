'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { History, BookOpen, FileText, Bot, Layers, Trash2, Eye } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GeneratedContent } from '@/components/generated-content';
import { QuizModule } from '@/components/quiz-module';
import { FlashcardModule } from '@/components/flashcard-module';
import { parseFlashcards } from '@/lib/utils';
import { HistoryItem, QuizData, Flashcard as FlashcardType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap = {
  Notes: <FileText className="h-4 w-4" />,
  Summary: <BookOpen className="h-4 w-4" />,
  MCQ: <Bot className="h-4 w-4" />,
  Flashcards: <Layers className="h-4 w-4" />,
};

export default function HistoryPage() {
  const { history, clearHistory, isLoaded } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const renderContent = (item: HistoryItem) => {
    if (!item) return null;

    switch (item.type) {
      case 'Notes':
      case 'Summary':
        return <GeneratedContent topic={item.topic} content={item.content} />;
      case 'MCQ':
        try {
          const quizData: QuizData = JSON.parse(item.content);
          return <QuizModule topic={item.topic} quizData={quizData} />;
        } catch (error) {
          return <p className="text-destructive">Failed to parse quiz data.</p>;
        }
      case 'Flashcards':
        const flashcards: FlashcardType[] = parseFlashcards(item.content);
        return <FlashcardModule topic={item.topic} flashcards={flashcards} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">Content History</CardTitle>
          <CardDescription>Review and reuse your previously generated content.</CardDescription>
        </div>
        <Button variant="destructive" size="sm" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <Dialog onOpenChange={(open) => !open && setSelectedItem(null)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoaded && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading history...
                  </TableCell>
                </TableRow>
              )}
              {isLoaded && history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <History className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    No history found. Generate some content to get started!
                  </TableCell>
                </TableRow>
              )}
              {isLoaded &&
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.topic}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        {iconMap[item.type]}
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(parseISO(item.timestamp), 'PPpp')}</TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {selectedItem && (
            <DialogContent className="max-w-4xl w-full h-[90vh]">
              <DialogHeader>
                <DialogTitle className="font-headline capitalize">{selectedItem.topic}</DialogTitle>
                <DialogDescription>
                  {selectedItem.type} generated on {format(parseISO(selectedItem.timestamp), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-full pr-6 -mr-6">
                <div className="py-4">
                 {renderContent(selectedItem)}
                </div>
              </ScrollArea>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
}
