
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIProvider } from '@/types/apiIntegrations';
import { integrationService } from '@/services/integrationService';
import { credentialsService } from '@/services/credentialsService';
import { useTrelloAPI } from '@/hooks/integrations/useTrelloAPI';
import { useGoogleCalendarAPI } from '@/hooks/integrations/useGoogleCalendarAPI';
import { useAIAPI } from '@/hooks/integrations/useAIAPI';
import { useGoogleDriveAPI } from '@/hooks/integrations/useGoogleDriveAPI';
import { useCalendlyAPI } from '@/hooks/integrations/useCalendlyAPI';

interface UseIntegrationConnectionsProps {
  integrations: any[];
  loadIntegrations: () => Promise<void>;
  setRealTimeData: (updater: (prev: any) => any) => void;
  setIsLoading: (loading: boolean) => void;
  user: any;
}

export const useIntegrationConnections = ({
  integrations,
  loadIntegrations,
  setRealTimeData,
  setIsLoading,
  user
}: UseIntegrationConnectionsProps) => {
  const { toast } = useToast();
  const { connectTrelloAPI: trelloConnect } = useTrelloAPI();
  const { connectGoogleCalendar: googleConnect } = useGoogleCalendarAPI();
  const { connectAIAPI: aiConnect } = useAIAPI();
  const { connectCalendlyAPI: calendlyConnect } = useCalendlyAPI();
  const { connectGoogleDrive: googleDriveConnect } = useGoogleDriveAPI();

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
  }, [trelloConnect, loadIntegrations, toast, user, integrations, setIsLoading, setRealTimeData]);

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
  }, [googleConnect, loadIntegrations, toast, user, integrations, setIsLoading, setRealTimeData]);

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
  }, [aiConnect, loadIntegrations, toast, user, integrations, setIsLoading]);

  const connectCalendlyAPI = useCallback(async (accessToken: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect APIs",
        variant: "destructive"
      });
      return;
    }

    // Check for existing Calendly connection
    const existingCalendly = integrations.find(int => int.provider === 'calendly');
    if (existingCalendly) {
      toast({
        title: "Already Connected",
        description: "Calendly is already connected. Disconnect first to add a new connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await calendlyConnect(accessToken);
      
      // Store in database
      const dbIntegration = await integrationService.createIntegration(
        'Calendly',
        'calendly',
        'scheduling',
        { access_token: accessToken }
      );

      if (result.data) {
        await integrationService.storeIntegrationData(
          dbIntegration.id,
          'event_types',
          result.data
        );
        setRealTimeData(prev => ({ ...prev, calendly: result.data }));
      }

      await loadIntegrations();

      toast({
        title: "Calendly Connected",
        description: "Successfully connected to Calendly API",
      });
    } catch (error) {
      console.error('Calendly connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Calendly API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [calendlyConnect, loadIntegrations, toast, user, integrations, setIsLoading, setRealTimeData]);

  const connectGoogleDrive = useCallback(async (accessToken: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect APIs",
        variant: "destructive"
      });
      return;
    }

    // Check for existing Google Drive connection
    const existingDrive = integrations.find(int => int.provider === 'google-drive');
    if (existingDrive) {
      toast({
        title: "Already Connected",
        description: "Google Drive is already connected. Disconnect first to add a new connection.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleDriveConnect(accessToken);
      
      // Store in database
      const dbIntegration = await integrationService.createIntegration(
        'Google Drive',
        'google-drive',
        'storage',
        { access_token: accessToken }
      );

      if (result.data) {
        await integrationService.storeIntegrationData(
          dbIntegration.id,
          'files',
          result.data
        );
        setRealTimeData(prev => ({ ...prev, googleDrive: result.data }));
      }

      await loadIntegrations();

      toast({
        title: "Google Drive Connected",
        description: "Successfully connected to Google Drive API",
      });
    } catch (error) {
      console.error('Google Drive connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Drive API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [googleDriveConnect, loadIntegrations, toast, user, integrations, setIsLoading, setRealTimeData]);

  return {
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    connectCalendlyAPI,
    connectGoogleDrive
  };
};
