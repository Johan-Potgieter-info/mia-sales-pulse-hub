
import { useIntegrationState } from '@/hooks/integrations/useIntegrationState';
import { useIntegrationConnections } from '@/hooks/integrations/useIntegrationConnections';
import { useIntegrationManagement } from '@/hooks/integrations/useIntegrationManagement';

export const useAPIIntegrations = () => {
  const {
    integrations,
    realTimeData,
    setRealTimeData,
    isLoading,
    setIsLoading,
    loadIntegrations,
    user
  } = useIntegrationState();

  const {
    connectTrelloAPI,
    connectGoogleCalendar,
    connectAIAPI,
    connectCalendlyAPI,
    connectGoogleDrive
  } = useIntegrationConnections({
    integrations,
    loadIntegrations,
    setRealTimeData,
    setIsLoading,
    user
  });

  const {
    refreshIntegration,
    disconnectIntegration
  } = useIntegrationManagement({
    integrations,
    loadIntegrations,
    setRealTimeData,
    user,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectCalendlyAPI,
    connectGoogleDrive
  });

  return {
    integrations: integrations.filter(int => int.hasData || int.status === 'error' || int.category === 'ai'),
    realTimeData,
    isLoading,
    connectTrelloAPI,
    connectGoogleCalendar,
    connectCalendlyAPI,
    connectAIAPI,
    connectGoogleDrive,
    refreshIntegration,
    disconnectIntegration
  };
};

export type { APIIntegration, RealTimeData } from '@/types/apiIntegrations';
