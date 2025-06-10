import { useCallback } from 'react';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useGoogleSheets = () => {
  const { toast } = useToast();

  const connectGoogleSheet = useCallback(async (url: string) => {
    try {
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('Invalid Google Sheets URL');
      }
      const sheetId = match[1];

      const integration: APIIntegration = {
        id: `google-sheet-${sheetId}`,
        name: 'Google Sheet',
        provider: 'google-sheets',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Spreadsheet from Google Sheets',
        icon: <FileText className="w-4 h-4 text-green-500" />,
        category: 'docs',
        hasData: true,
        metrics: {
          'Sheet ID': sheetId,
          'Status': 'Connected'
        }
      };

      toast({
        title: 'Google Sheet Added',
        description: 'Spreadsheet URL saved',
      });

      return { integration, data: { url } };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      const failedIntegration: APIIntegration = {
        id: 'google-sheet',
        name: 'Google Sheet',
        provider: 'google-sheets',
        status: 'error',
        lastSync: null,
        description: 'Spreadsheet from Google Sheets',
        icon: <FileText className="w-4 h-4 text-red-500" />,
        category: 'docs',
        hasData: false,
        errorMessage
      };

      toast({
        title: 'Google Sheet Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectGoogleSheet };
};
