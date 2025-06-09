
import { useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useCalendlyAPI = () => {
  const { toast } = useToast();

  const connectCalendlyAPI = useCallback(async (accessToken: string) => {
    try {
      console.log('Connecting to Calendly API...');
      const response = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Calendly API error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to connect to Calendly'}`);
      }
      
      const userData = await response.json();
      console.log('Calendly user data retrieved:', userData);

      // Get event types
      const eventTypesResponse = await fetch(`https://api.calendly.com/event_types?user=${userData.resource.uri}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const eventTypesData = await eventTypesResponse.json();
      const eventTypes = eventTypesData.collection || [];
      
      const integration: APIIntegration = {
        id: 'calendly',
        name: 'Calendly',
        provider: 'calendly',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Scheduling and appointment management',
        icon: <Calendar className="w-4 h-4 text-blue-500" />,
        category: 'scheduling',
        accessToken,
        hasData: eventTypes.length > 0,
        metrics: {
          'Event Types': eventTypes.length,
          'Status': 'Connected'
        }
      };

      toast({
        title: "Calendly Connected",
        description: `Successfully connected with ${eventTypes.length} event types`,
      });

      return { integration, data: { eventTypes, user: userData.resource } };

    } catch (error) {
      console.error('Calendly connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: 'calendly',
        name: 'Calendly',
        provider: 'calendly',
        status: 'error',
        lastSync: null,
        description: 'Scheduling and appointment management',
        icon: <Calendar className="w-4 h-4 text-red-500" />,
        category: 'scheduling',
        hasData: false,
        errorMessage
      };

      toast({
        title: "Calendly Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectCalendlyAPI };
};
