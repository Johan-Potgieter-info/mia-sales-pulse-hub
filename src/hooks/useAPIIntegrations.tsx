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
  errorMessage?: string;
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
      console.log('Connecting to Trello API...');
      // Real Trello API call
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Store failed integration with error details
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

      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'trello');
        return [...filtered, failedIntegration];
      });

      toast({
        title: "Trello Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connectGoogleCalendar = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    try {
      console.log('Connecting to Google Calendar API...');
      // Real Google Calendar API call
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${accessToken}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Calendar API error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to connect to Google Calendar'}`);
      }
      
      const data = await response.json();
      const events = data.items || [];
      console.log('Google Calendar events retrieved:', events.length);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Store failed integration with error details
      const failedIntegration: APIIntegration = {
        id: 'google-calendar',
        name: 'Google Calendar',
        status: 'error',
        lastSync: null,
        description: 'Calendar events and scheduling',
        icon: <Calendar className="w-4 h-4 text-red-500" />,
        category: 'calendar',
        hasData: false,
        errorMessage
      };

      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'google-calendar');
        return [...filtered, failedIntegration];
      });

      toast({
        title: "Google Calendar Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const connectAIAPI = useCallback(async (apiKey: string, provider: 'openai' | 'claude', model: string) => {
    setIsLoading(true);
    try {
      console.log(`Connecting to ${provider} API with model ${model}...`);
      
      let response: Response;
      let testSuccessful = false;
      let errorDetails = '';

      if (provider === 'openai') {
        // Test OpenAI API connection
        try {
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: 'Test connection' }],
              max_tokens: 5
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('OpenAI API error:', response.status, errorData);
            
            if (response.status === 401) {
              errorDetails = 'Invalid API key. Please check your OpenAI API key.';
            } else if (response.status === 429) {
              errorDetails = 'Rate limit exceeded. Please try again later.';
            } else if (response.status === 400 && errorData?.error?.code === 'model_not_found') {
              errorDetails = `Model "${model}" not found. Please check the model name.`;
            } else {
              errorDetails = errorData?.error?.message || `HTTP ${response.status}: Failed to connect to OpenAI`;
            }
            throw new Error(errorDetails);
          }

          const result = await response.json();
          console.log('OpenAI API test successful:', result);
          testSuccessful = true;
        } catch (fetchError) {
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            errorDetails = 'Network error: Cannot reach OpenAI API. Check your internet connection.';
          } else {
            errorDetails = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
          }
          throw fetchError;
        }
      } else if (provider === 'claude') {
        // Test Anthropic Claude API connection
        try {
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model,
              max_tokens: 5,
              messages: [{ role: 'user', content: 'Test connection' }]
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Claude API error:', response.status, errorData);
            
            if (response.status === 401) {
              errorDetails = 'Invalid API key. Please check your Anthropic API key.';
            } else if (response.status === 429) {
              errorDetails = 'Rate limit exceeded. Please try again later.';
            } else if (response.status === 400 && errorData?.error?.type === 'invalid_request_error') {
              errorDetails = `Model "${model}" not found or invalid. Please check the model name.`;
            } else {
              errorDetails = errorData?.error?.message || `HTTP ${response.status}: Failed to connect to Claude`;
            }
            throw new Error(errorDetails);
          }

          const result = await response.json();
          console.log('Claude API test successful:', result);
          testSuccessful = true;
        } catch (fetchError) {
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            errorDetails = 'Network error: Cannot reach Anthropic API. Check your internet connection.';
          } else {
            errorDetails = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
          }
          throw fetchError;
        }
      }

      if (testSuccessful) {
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
            'Provider': provider === 'openai' ? 'OpenAI' : 'Anthropic',
            'Status': 'Connected'
          }
        };

        setIntegrations(prev => {
          const filtered = prev.filter(int => !int.id.startsWith('ai-'));
          return [...filtered, integration];
        });

        toast({
          title: "AI API Connected",
          description: `Successfully connected to ${provider === 'openai' ? 'OpenAI' : 'Claude'} using ${model}`,
        });
      }

    } catch (error) {
      console.error('AI API connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Store failed integration with error details
      const failedIntegration: APIIntegration = {
        id: `ai-${provider}`,
        name: `${provider === 'openai' ? 'OpenAI' : 'Claude'} AI`,
        status: 'error',
        lastSync: null,
        description: `AI insights powered by ${model}`,
        icon: <MessageSquare className="w-4 h-4 text-red-500" />,
        category: 'ai',
        hasData: false,
        errorMessage
      };

      setIntegrations(prev => {
        const filtered = prev.filter(int => !int.id.startsWith('ai-'));
        return [...filtered, failedIntegration];
      });

      toast({
        title: "AI API Connection Failed",
        description: errorMessage,
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
    integrations: integrations.filter(int => int.hasData || int.status === 'error'), // Show integrations with data or errors
    realTimeData,
    isLoading,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    refreshIntegration,
    disconnectIntegration
  };
};
