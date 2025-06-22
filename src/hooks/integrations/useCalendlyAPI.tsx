
import { useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useCalendlyAPI = () => {
  const { toast } = useToast();

  const connectCalendlyAPI = useCallback(async (accessToken: string) => {
    try {
      console.log('Connecting to Calendly API...');
      
      // First, get user info to validate the token
      const userResponse = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('Calendly user API error:', userResponse.status, errorText);
        throw new Error(`HTTP ${userResponse.status}: ${errorText || 'Failed to connect to Calendly'}`);
      }

      const userData = await userResponse.json();
      console.log('Calendly user data retrieved:', userData);

      // Get event types
      const eventTypesResponse = await fetch(`https://api.calendly.com/event_types?user=${userData.resource.uri}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!eventTypesResponse.ok) {
        console.error('Calendly event types error:', eventTypesResponse.status);
        // Don't fail completely if event types fail
      }

      const eventTypesData = eventTypesResponse.ok ? await eventTypesResponse.json() : { collection: [] };
      console.log('Calendly event types retrieved:', eventTypesData.collection?.length || 0);

      // Try to get scheduled events (this might fail due to permissions)
      let scheduledEvents = [];
      try {
        const eventsResponse = await fetch(`https://api.calendly.com/scheduled_events?user=${userData.resource.uri}&count=10`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          scheduledEvents = eventsData.collection || [];
          console.log('Calendly scheduled events retrieved:', scheduledEvents.length);
        }
      } catch (error) {
        console.log('Could not fetch scheduled events (this is normal for some Calendly plans)');
      }

      const integration: APIIntegration = {
        id: 'calendly',
        name: 'Calendly',
        provider: 'calendly',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Scheduling and booking management',
        icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
        category: 'scheduling',
        accessToken,
        hasData: eventTypesData.collection?.length > 0 || scheduledEvents.length > 0,
        metrics: {
          'Event Types': eventTypesData.collection?.length || 0,
          'Scheduled Events': scheduledEvents.length,
          'User': userData.resource?.name || 'Connected',
          'Status': 'Connected'
        }
      };

      const data = {
        user: userData.resource,
        eventTypes: eventTypesData.collection || [],
        scheduledEvents
      };

      toast({
        title: "Calendly Connected",
        description: `Successfully connected to Calendly account: ${userData.resource?.name}`,
      });

      return { integration, data };

    } catch (error) {
      console.error('Calendly connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: 'calendly',
        name: 'Calendly',
        provider: 'calendly',
        status: 'error',
        lastSync: null,
        description: 'Scheduling and booking management',
        icon: <CalendarDays className="w-4 h-4 text-red-500" />,
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
