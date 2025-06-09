
import { useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useCalendlyAPI = () => {
  const { toast } = useToast();

  const connectCalendlyAPI = useCallback(async (accessToken: string) => {
    try {
      console.log('Connecting to Calendly API...');
      
      // Get user information
      const userResponse = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('Calendly API error:', userResponse.status, errorText);
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
        const errorText = await eventTypesResponse.text();
        console.error('Calendly event types error:', eventTypesResponse.status, errorText);
        throw new Error(`HTTP ${eventTypesResponse.status}: ${errorText || 'Failed to fetch event types'}`);
      }

      const eventTypesData = await eventTypesResponse.json();
      const eventTypes = eventTypesData.collection || [];

      // Get recent scheduled events (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const eventsResponse = await fetch(
        `https://api.calendly.com/scheduled_events?user=${userData.resource.uri}&min_start_time=${thirtyDaysAgo.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let scheduledEvents = [];
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        scheduledEvents = eventsData.collection || [];
      } else {
        console.warn('Could not fetch scheduled events, but continuing with event types');
      }
      
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
          'Recent Events': scheduledEvents.length,
          'Status': 'Connected'
        }
      };

      toast({
        title: "Calendly Connected",
        description: `Successfully connected with ${eventTypes.length} event types and ${scheduledEvents.length} recent events`,
      });

      return { 
        integration, 
        data: { 
          eventTypes, 
          user: userData.resource,
          scheduledEvents: scheduledEvents
        } 
      };

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
