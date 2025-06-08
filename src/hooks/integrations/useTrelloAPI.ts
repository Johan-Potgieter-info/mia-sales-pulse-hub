
import { useCallback } from 'react';
import { Trello } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useTrelloAPI = () => {
  const { toast } = useToast();

  const connectTrelloAPI = useCallback(async (apiKey: string, token: string) => {
    try {
      console.log('Connecting to Trello API...');
      const response = await fetch(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Trello API error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to connect to Trello'}`);
      }
      
      const boards = await response.json();
      console.log('Trello boards retrieved:', boards.length);
      
      const integration: APIIntegration = {
        id: 'trello',
        name: 'Trello',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Project management and task tracking',
        icon: <Trello className="w-4 h-4 text-blue-500" />,
        category: 'project',
        apiKey,
        accessToken: token,
        hasData: boards.length > 0,
        metrics: {
          'Boards': boards.length,
          'Status': 'Connected'
        }
      };

      toast({
        title: "Trello Connected",
        description: `Successfully connected to ${boards.length} boards`,
      });

      return { integration, data: { boards, cards: [] } };

    } catch (error) {
      console.error('Trello connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: 'trello',
        name: 'Trello',
        status: 'error',
        lastSync: null,
        description: 'Project management and task tracking',
        icon: <Trello className="w-4 h-4 text-red-500" />,
        category: 'project',
        hasData: false,
        errorMessage
      };

      toast({
        title: "Trello Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectTrelloAPI };
};
