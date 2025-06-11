
import { useState, useCallback, useEffect } from 'react';
import { APIIntegration, RealTimeData } from '@/types/apiIntegrations';
import { integrationService } from '@/services/integrationService';
import { useAuth } from '@/hooks/useAuth';

export const useIntegrationState = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadIntegrations = useCallback(async () => {
    if (!user) {
      setIntegrations([]);
      setRealTimeData({});
      return;
    }

    try {
      const dbIntegrations = await integrationService.getUserIntegrations();
      
      // Convert database integrations to the expected format and load their data
      const formattedIntegrations: APIIntegration[] = await Promise.all(
        dbIntegrations.map(async (dbInt) => {
          // Get icon based on provider
          const getIcon = (provider: string) => {
            switch (provider) {
              case 'trello': return '🗂️';
              case 'google-calendar': return '📅';
              case 'openai': case 'claude': return '🤖';
              case 'google-drive': return '🗂️';
              default: return '🔗';
            }
          };

          // Load integration data if it exists
          const integrationData = await integrationService.getIntegrationData(dbInt.id);
          
          // Update real-time data based on integration type
          if (integrationData && integrationData.length > 0) {
            const latestData = integrationData[0]; // Get most recent data
            
            if (dbInt.provider === 'google-calendar') {
              setRealTimeData(prev => ({
                ...prev,
                googleCalendar: latestData.data
              }));
            } else if (dbInt.provider === 'trello') {
              setRealTimeData(prev => ({
                ...prev,
                trello: latestData.data
              }));
            } else if (dbInt.provider === 'google-drive') {
              setRealTimeData(prev => ({
                ...prev,
                googleDrive: latestData.data
              }));
            }
          }

          return {
            id: dbInt.id,
            name: dbInt.name,
            provider: dbInt.provider,
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

  return {
    integrations,
    realTimeData,
    setRealTimeData,
    isLoading,
    setIsLoading,
    loadIntegrations,
    user
  };
};
