
import { useState, useCallback, useEffect } from 'react';
import { Calendar, Database, Trello, FileText, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface APIIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string | null;
  description: string;
  icon: React.ReactNode;
  metrics?: Record<string, string | number>;
  category: string;
  apiKey?: string;
  accessToken?: string;
  hasData: boolean;
}

export interface RealTimeData {
  trello?: {
    boards: any[];
    cards: any[];
  };
  googleCalendar?: {
    events: any[];
  };
  googleSheets?: {
    sheets: any[];
  };
  aiInsights?: {
    insights: any[];
  };
}

export const useAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load integrations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mia-api-integrations');
    if (stored) {
      try {
        const parsedIntegrations = JSON.parse(stored);
        setIntegrations(parsedIntegrations);
      } catch (error) {
        console.error('Failed to parse stored integrations:', error);
      }
    }
  }, []);

  // Save integrations to localStorage whenever they change
  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem('mia-api-integrations', JSON.stringify(integrations));
    }
  }, [integrations]);

  const connectTrelloAPI = useCallback(async (apiKey: string, token: string) => {
    setIsLoading(true);
    try {
      // Real Trello API call
      const response = await fetch(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`);
      if (!response.ok) throw new Error('Failed to connect to Trello');
      
      const boards = await response.json();
      
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

      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'trello');
        return [...filtered, integration];
      });

      setRealTimeData(prev => ({ ...prev, trello: { boards, cards: [] } }));

      toast({
        title: "Trello Connected",
        description: `Successfully connected to ${boards.length} boards`,
      });

    } catch (error) {
      console.error('Trello connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Trello. Please check your API credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connectGoogleCalendar = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    try {
      // Real Google Calendar API call
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${accessToken}`);
      if (!response.ok) throw new Error('Failed to connect to Google Calendar');
      
      const data = await response.json();
      const events = data.items || [];
      
      const integration: APIIntegration = {
        id: 'google-calendar',
        name: 'Google Calendar',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Calendar events and scheduling',
        icon: <Calendar className="w-4 h-4 text-green-500" />,
        category: 'calendar',
        accessToken,
        hasData: events.length > 0,
        metrics: {
          'Events': events.length,
          'Status': 'Connected'
        }
      };

      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'google-calendar');
        return [...filtered, integration];
      });

      setRealTimeData(prev => ({ ...prev, googleCalendar: { events } }));

      toast({
        title: "Google Calendar Connected",
        description: `Successfully connected with ${events.length} events`,
      });

    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please check your access token.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connectAIAPI = useCallback(async (apiKey: string, provider: 'openai' | 'claude', model: string) => {
    setIsLoading(true);
    try {
      // Test AI API connection
      const baseUrl = provider === 'openai' 
        ? 'https://api.openai.com/v1/chat/completions'
        : 'https://api.anthropic.com/v1/messages';

      const headers = provider === 'openai'
        ? { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
        : { 'x-api-key': apiKey, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' };

      const body = provider === 'openai'
        ? { model, messages: [{ role: 'user', content: 'Test connection' }], max_tokens: 5 }
        : { model, max_tokens: 5, messages: [{ role: 'user', content: 'Test connection' }] };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to connect to AI API');

      const integration: APIIntegration = {
        id: `ai-${provider}`,
        name: `${provider === 'openai' ? 'OpenAI' : 'Claude'} AI`,
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: `AI insights powered by ${model}`,
        icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
        category: 'ai',
        apiKey,
        hasData: true,
        metrics: {
          'Model': model,
          'Status': 'Connected'
        }
      };

      setIntegrations(prev => {
        const filtered = prev.filter(int => !int.id.startsWith('ai-'));
        return [...filtered, integration];
      });

      toast({
        title: "AI API Connected",
        description: `Successfully connected to ${provider === 'openai' ? 'OpenAI' : 'Claude'}`,
      });

    } catch (error) {
      console.error('AI API connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to AI API. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshIntegration = useCallback(async (integrationId: string) => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration) return;

    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'syncing' as const }
          : int
      )
    );

    try {
      if (integrationId === 'trello' && integration.apiKey && integration.accessToken) {
        await connectTrelloAPI(integration.apiKey, integration.accessToken);
      } else if (integrationId === 'google-calendar' && integration.accessToken) {
        await connectGoogleCalendar(integration.accessToken);
      } else {
        // For other integrations, just update the timestamp
        setIntegrations(prev => 
          prev.map(int => 
            int.id === integrationId 
              ? { ...int, lastSync: new Date().toLocaleString(), status: 'connected' as const }
              : int
          )
        );
      }
    } catch (error) {
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, status: 'error' as const }
            : int
        )
      );
    }
  }, [integrations, connectTrelloAPI, connectGoogleCalendar]);

  const disconnectIntegration = useCallback((integrationId: string) => {
    setIntegrations(prev => prev.filter(int => int.id !== integrationId));
    
    // Clear related data
    setRealTimeData(prev => {
      const newData = { ...prev };
      if (integrationId === 'trello') delete newData.trello;
      if (integrationId === 'google-calendar') delete newData.googleCalendar;
      if (integrationId.startsWith('ai-')) delete newData.aiInsights;
      return newData;
    });

    toast({
      title: "Integration Disconnected",
      description: "API integration has been removed",
    });
  }, [toast]);

  return {
    integrations: integrations.filter(int => int.hasData), // Only return integrations with data
    realTimeData,
    isLoading,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    refreshIntegration,
    disconnectIntegration
  };
};
