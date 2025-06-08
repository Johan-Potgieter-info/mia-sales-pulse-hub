
import { useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useGoogleCalendarAPI = () => {
  const { toast } = useToast();

  const connectGoogleCalendar = useCallback(async (accessToken: string) => {
    try {
      console.log('Connecting to Google Calendar API...');
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
        provider: 'google-calendar',
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

      toast({
        title: "Google Calendar Connected",
        description: `Successfully connected with ${events.length} events`,
      });

      return { integration, data: { events } };

    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: 'google-calendar',
        name: 'Google Calendar',
        provider: 'google-calendar',
        status: 'error',
        lastSync: null,
        description: 'Calendar events and scheduling',
        icon: <Calendar className="w-4 h-4 text-red-500" />,
        category: 'calendar',
        hasData: false,
        errorMessage
      };

      toast({
        title: "Google Calendar Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectGoogleCalendar };
};
