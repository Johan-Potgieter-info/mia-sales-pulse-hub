
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration, RealTimeData, AIProvider } from '@/types/apiIntegrations';
import { useTrelloAPI } from '@/hooks/integrations/useTrelloAPI';
import { useGoogleCalendarAPI } from '@/hooks/integrations/useGoogleCalendarAPI';
import { useAIAPI } from '@/hooks/integrations/useAIAPI';

export const useAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { connectTrelloAPI: trelloConnect } = useTrelloAPI();
  const { connectGoogleCalendar: googleConnect } = useGoogleCalendarAPI();
  const { connectAIAPI: aiConnect } = useAIAPI();

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
      const result = await trelloConnect(apiKey, token);
      
      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'trello');
        return [...filtered, result.integration];
      });

      if (result.data) {
        setRealTimeData(prev => ({ ...prev, trello: result.data }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [trelloConnect]);

  const connectGoogleCalendar = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    try {
      const result = await googleConnect(accessToken);
      
      setIntegrations(prev => {
        const filtered = prev.filter(int => int.id !== 'google-calendar');
        return [...filtered, result.integration];
      });

      if (result.data) {
        setRealTimeData(prev => ({ ...prev, googleCalendar: result.data }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [googleConnect]);

  const connectAIAPI = useCallback(async (apiKey: string, provider: AIProvider, model: string) => {
    setIsLoading(true);
    try {
      const result = await aiConnect(apiKey, provider, model);
      
      setIntegrations(prev => {
        const filtered = prev.filter(int => !int.id.startsWith('ai-'));
        return [...filtered, result.integration];
      });
    } finally {
      setIsLoading(false);
    }
  }, [aiConnect]);

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
    integrations: integrations.filter(int => int.hasData || int.status === 'error'),
    realTimeData,
    isLoading,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    refreshIntegration,
    disconnectIntegration
  };
};

export { APIIntegration, RealTimeData } from '@/types/apiIntegrations';
