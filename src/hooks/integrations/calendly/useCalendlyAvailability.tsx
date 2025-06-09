
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { CalendlyAvailability } from '@/types/calendly';

export const useCalendlyAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getAvailability = useCallback(async (
    eventTypeUri: string, 
    startTime: string, 
    endTime: string
  ): Promise<CalendlyAvailability | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calendly-availability', {
        body: {
          event_type_uri: eventTypeUri,
          start_time: startTime,
          end_time: endTime
        }
      });

      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to get availability:', error);
      toast({
        title: "Availability Error",
        description: "Failed to fetch availability",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    getAvailability,
  };
};
