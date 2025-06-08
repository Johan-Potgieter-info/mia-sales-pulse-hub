import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration, RealTimeData, AIProvider } from '@/types/apiIntegrations';
import { useTrelloAPI } from '@/hooks/integrations/useTrelloAPI';
import { useGoogleCalendarAPI } from '@/hooks/integrations/useGoogleCalendarAPI';
import { useAIAPI } from '@/hooks/integrations/useAIAPI';
import { integrationService } from '@/services/integrationService';
import { credentialsService } from '@/services/credentialsService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { connectTrelloAPI: trelloConnect } = useTrelloAPI();
  const { connectGoogleCalendar: googleConnect } = useGoogleCalendarAPI();
  const { connectAIAPI: aiConnect } = useAIAPI();

  // Load integrations from database
  const loadIntegrations = useCallback(async () => {
    if (!user) {
      setIntegrations([]);
      setRealTimeData({});
      return;
    }

    try {
      const dbIntegrations = await integrationService.getUserIntegrations();
      
      // Convert database integrations to the expected format
      const formattedIntegrations: APIIntegration[] = await Promise.all(
        dbIntegrations.map(async (dbInt) => {
          // Get icon based on provider
          const getIcon = (provider: string) => {
            switch (provider) {
              case 'trello': return '🗂️';
              case 'google-calendar': return '📅';
              case 'openai': case 'claude': return '🤖';
              default: return '🔗';
            }
          };

          return {
            id: dbInt.id,
            name: dbInt.name,
            status: dbInt.status,
            lastSync: dbInt.last_sync || null,
            description: `${dbInt.provider} integration`,
            icon: getIcon(dbInt.provider),
            category: dbInt.category,
            hasData: dbInt.has_data,
            metrics: {}
          };
        })
      );

      setIntegrations(formattedIntegrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  }, [user]);

  // Load integrations when user changes
  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const connectTrelloAPI = useCallback(async (apiKey: string, token: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect APIs",
        variant: "destructive"
      });
      return;
    }

    // Check for existing Trello connection
    const existingTrello = integrations.find(int => int.provider === 'trello');
    if (existingTrello) {
      toast({
        title: "Already Connected",
        description: "Trello is already connected. Disconnect first to add a new connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await trelloConnect(apiKey, token);
      
      // Store in database
      const dbIntegration = await integrationService.createIntegration(
        'Trello',
        'trello',
        'productivity',
        { api_key: apiKey, access_token: token }
      );

      if (result.data) {
        await integrationService.storeIntegrationData(
          dbIntegration.id,
          'boards',
          result.data
        );
        setRealTimeData(prev => ({ ...prev, trello: result.data }));
      }

      // Reload integrations to get the updated list
      await loadIntegrations();

      toast({
        title: "Trello Connected",
        description: "Successfully connected to Trello API",
      });
    } catch (error) {
      console.error('Trello connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Trello API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [trelloConnect, loadIntegrations, toast, user, integrations]);

  const connectGoogleCalendar = useCallback(async (accessToken: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect APIs",
        variant: "destructive"
      });
      return;
    }

    // Check for existing Google Calendar connection
    const existingCalendar = integrations.find(int => int.provider === 'google-calendar');
    if (existingCalendar) {
      toast({
        title: "Already Connected",
        description: "Google Calendar is already connected. Disconnect first to add a new connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleConnect(accessToken);
      
      // Store in database
      const dbIntegration = await integrationService.createIntegration(
        'Google Calendar',
        'google-calendar',
        'calendar',
        { access_token: accessToken }
      );

      if (result.data) {
        await integrationService.storeIntegrationData(
          dbIntegration.id,
          'events',
          result.data
        );
        setRealTimeData(prev => ({ ...prev, googleCalendar: result.data }));
      }

      await loadIntegrations();

      toast({
        title: "Google Calendar Connected",
        description: "Successfully connected to Google Calendar API",
      });
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [googleConnect, loadIntegrations, toast, user, integrations]);

  const connectAIAPI = useCallback(async (apiKey: string, provider: AIProvider, model: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect APIs",
        variant: "destructive"
      });
      return;
    }

    // Check for existing AI connection of the same provider
    const existingAI = integrations.find(int => int.provider === provider && int.category === 'ai');
    if (existingAI) {
      toast({
        title: "Already Connected",
        description: `${provider.toUpperCase()} AI is already connected. Disconnect first to add a new connection.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiConnect(apiKey, provider, model);
      
      // Store in database
      await integrationService.createIntegration(
        `${provider.toUpperCase()} AI`,
        provider,
        'ai',
        { api_key: apiKey, model: model }
      );

      await loadIntegrations();

      toast({
        title: "AI API Connected",
        description: `Successfully connected to ${provider.toUpperCase()} API`,
      });
    } catch (error) {
      console.error('AI API connection failed:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${provider.toUpperCase()} API`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [aiConnect, loadIntegrations, toast, user, integrations]);

  const refreshIntegration = useCallback(async (integrationId: string) => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration || !user) return;

    try {
      await integrationService.updateIntegrationStatus(integrationId, 'syncing');
      await loadIntegrations();

      // Get credentials and refresh data based on integration type
      const credentials = await credentialsService.getIntegrationCredentials(integrationId);
      
      if (integration.id.includes('trello') && credentials.api_key && credentials.access_token) {
        await connectTrelloAPI(credentials.api_key, credentials.access_token);
      } else if (integration.id.includes('google-calendar') && credentials.access_token) {
        await connectGoogleCalendar(credentials.access_token);
      } else {
        await integrationService.updateIntegrationStatus(integrationId, 'connected');
        await loadIntegrations();
      }
    } catch (error) {
      await integrationService.updateIntegrationStatus(integrationId, 'error');
      await loadIntegrations();
    }
  }, [integrations, connectTrelloAPI, connectGoogleCalendar, loadIntegrations, user]);

  const disconnectIntegration = useCallback(async (integrationId: string) => {
    if (!user) return;

    try {
      await integrationService.deleteIntegration(integrationId);
      await loadIntegrations();
      
      // Clean up real-time data
      setRealTimeData(prev => {
        const newData = { ...prev };
        const integration = integrations.find(int => int.id === integrationId);
        if (integration) {
          if (integration.id.includes('trello')) delete newData.trello;
          if (integration.id.includes('google-calendar')) delete newData.googleCalendar;
          if (integration.category === 'ai') delete newData.aiInsights;
        }
        return newData;
      });

      toast({
        title: "Integration Disconnected",
        description: "API integration has been removed",
      });
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect integration",
        variant: "destructive"
      });
    }
  }, [integrations, loadIntegrations, toast, user]);

  return {
    integrations: integrations.filter(int => int.hasData || int.status === 'error' || int.category === 'ai'),
    realTimeData,
    isLoading,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    refreshIntegration,
    disconnectIntegration
  };
};

export type { APIIntegration, RealTimeData } from '@/types/apiIntegrations';
