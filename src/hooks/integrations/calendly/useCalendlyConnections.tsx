
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { CalendlyConnection } from '@/types/calendly';

export const useCalendlyConnections = () => {
  const { toast } = useToast();

  const getConnections = useCallback(async (): Promise<CalendlyConnection[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('calendly-get-connections');

      if (error) throw error;
      return data?.connections || [];
      
    } catch (error) {
      console.error('Failed to get connections:', error);
      return [];
    }
  }, []);

  const disconnectConnection = useCallback(async (connectionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('calendly-disconnect', {
        body: { connection_id: connectionId }
      });

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: "Calendly connection has been disconnected",
      });
      
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect Calendly",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    getConnections,
    disconnectConnection,
  };
};
