
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { integrationService } from '@/services/integrationService';
import { credentialsService } from '@/services/credentialsService';

interface UseIntegrationManagementProps {
  integrations: any[];
  loadIntegrations: () => Promise<void>;
  setRealTimeData: (updater: (prev: any) => any) => void;
  user: any;
  connectTrelloAPI: (apiKey: string, token: string) => Promise<void>;
  connectGoogleCalendar: (accessToken: string) => Promise<void>;
  connectCalendlyAPI: (accessToken: string) => Promise<void>;
  connectGoogleDrive: (accessToken: string) => Promise<void>;
}

export const useIntegrationManagement = ({
  integrations,
  loadIntegrations,
  setRealTimeData,
  user,
  connectTrelloAPI,
  connectGoogleCalendar,
  connectCalendlyAPI,
  connectGoogleDrive
}: UseIntegrationManagementProps) => {
  const { toast } = useToast();

  const refreshIntegration = useCallback(async (integrationId: string) => {
    const integration = integrations.find(int => int.id === integrationId);
    if (!integration || !user) return;

    try {
      await integrationService.updateIntegrationStatus(integrationId, 'syncing');
      await loadIntegrations();

      // Get credentials and refresh data based on integration type
      const credentials = await credentialsService.getIntegrationCredentials(integrationId);
      
      if (integration.provider === 'trello' && credentials.api_key && credentials.access_token) {
        await connectTrelloAPI(credentials.api_key, credentials.access_token);
      } else if (integration.provider === 'google-calendar' && credentials.access_token) {
        await connectGoogleCalendar(credentials.access_token);
      } else if (integration.provider === 'calendly' && credentials.access_token) {
        await connectCalendlyAPI(credentials.access_token);
      } else if (integration.provider === 'google-drive' && credentials.access_token) {
        await connectGoogleDrive(credentials.access_token);
      } else {
        await integrationService.updateIntegrationStatus(integrationId, 'connected');
        await loadIntegrations();
      }
    } catch (error) {
      await integrationService.updateIntegrationStatus(integrationId, 'error');
      await loadIntegrations();
    }
  }, [integrations, connectTrelloAPI, connectGoogleCalendar, connectCalendlyAPI, connectGoogleDrive, loadIntegrations, user]);

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
          if (integration.provider === 'trello') delete newData.trello;
          if (integration.provider === 'google-calendar') delete newData.googleCalendar;
          if (integration.provider === 'calendly') delete newData.calendly;
          if (integration.provider === 'google-drive') delete newData.googleDrive;
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
  }, [integrations, loadIntegrations, toast, user, setRealTimeData]);

  return {
    refreshIntegration,
    disconnectIntegration
  };
};
