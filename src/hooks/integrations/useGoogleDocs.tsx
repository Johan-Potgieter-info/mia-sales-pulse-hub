import { useCallback } from 'react';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useGoogleDocs = () => {
  const { toast } = useToast();

  const connectGoogleDoc = useCallback(async (url: string) => {
    try {
      const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('Invalid Google Docs URL');
      }
      const docId = match[1];

      const integration: APIIntegration = {
        id: `google-doc-${docId}`,
        name: 'Google Doc',
        provider: 'google-docs',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Document from Google Docs',
        icon: <FileText className="w-4 h-4 text-green-500" />,
        category: 'docs',
        hasData: true,
        metrics: {
          'Doc ID': docId,
          'Status': 'Connected'
        }
      };

      toast({
        title: 'Google Document Added',
        description: 'Document URL saved',
      });

      return { integration, data: { url } };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      const failedIntegration: APIIntegration = {
        id: 'google-doc',
        name: 'Google Doc',
        provider: 'google-docs',
        status: 'error',
        lastSync: null,
        description: 'Document from Google Docs',
        icon: <FileText className="w-4 h-4 text-red-500" />,
        category: 'docs',
        hasData: false,
        errorMessage
      };

      toast({
        title: 'Google Doc Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectGoogleDoc };
};
