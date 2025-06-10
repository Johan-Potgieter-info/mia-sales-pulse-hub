import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

interface GoogleSheetConnectionFormProps {
  onConnect: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const GoogleSheetConnectionForm = ({ onConnect, isLoading }: GoogleSheetConnectionFormProps) => {
  const [sheetUrl, setSheetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.trim()) return;
    await onConnect(sheetUrl.trim());
    setSheetUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-500" />
          Add Google Spreadsheet
        </CardTitle>
        <CardDescription>Enter the share link of the spreadsheet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Paste the URL of a shared Google Spreadsheet.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-url">Spreadsheet URL</Label>
            <Input
              id="sheet-url"
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !sheetUrl.trim()} className="w-full">
            {isLoading ? 'Saving...' : 'Add Spreadsheet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
