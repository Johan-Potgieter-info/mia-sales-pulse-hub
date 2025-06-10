import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

interface GoogleDocConnectionFormProps {
  onConnect: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const GoogleDocConnectionForm = ({ onConnect, isLoading }: GoogleDocConnectionFormProps) => {
  const [docUrl, setDocUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) return;
    await onConnect(docUrl.trim());
    setDocUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-500" />
          Add Google Document
        </CardTitle>
        <CardDescription>Enter the share link of the document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Paste the URL of a shared Google Document.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-url">Document URL</Label>
            <Input
              id="doc-url"
              type="url"
              placeholder="https://docs.google.com/document/d/..."
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !docUrl.trim()} className="w-full">
            {isLoading ? 'Saving...' : 'Add Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
