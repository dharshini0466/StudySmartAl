import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Separator } from './ui/separator';

interface GeneratedContentProps {
  topic: string;
  content: string;
}

export function GeneratedContent({ topic, content }: GeneratedContentProps) {
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
          <div className="prose dark:prose-invert max-w-none">
            {content
              .split('\n')
              .map((line, index) =>
                line.trim() ? <p key={index}>{line.trim().replace(/^- /, '')}</p> : null
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
