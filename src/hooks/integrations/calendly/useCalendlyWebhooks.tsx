
import { useCallback } from 'react';
import type { CalendlyWebhookEvent } from '@/types/calendly';
import { supabase } from '@/integrations/supabase/client';

export const useCalendlyWebhooks = () => {
  const getWebhookEvents = useCallback(async (): Promise<CalendlyWebhookEvent[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('calendly-get-webhook-events');

      if (error) throw error;
      return data?.events || [];
      
    } catch (error) {
      console.error('Failed to get webhook events:', error);
      return [];
    }
  }, []);

  return {
    getWebhookEvents,
  };
};
