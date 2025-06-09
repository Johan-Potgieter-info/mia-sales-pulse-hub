
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface CalendlyConnection {
  id: string;
  calendly_user_uri: string;
  calendly_organization_uri: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  duration: number;
  scheduling_url: string;
  active: boolean;
  kind: string;
  description_plain?: string;
}

export interface CalendlyAvailableTime {
  start_time: string;
  invitee_start_time: string;
}

export interface CalendlyAvailability {
  collection: CalendlyAvailableTime[];
}

export const useCalendlyV2API = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiateOAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectUri = `${window.location.origin}/calendly-oauth-callback`;
      
      const { data, error } = await supabase.functions.invoke('calendly-oauth-init', {
        body: {
          scope: 'default',
          redirect_uri: redirectUri
        }
      });

      if (error) throw error;

      // Redirect to Calendly OAuth
      window.location.href = data.authorization_url;
      
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      toast({
        title: "OAuth Failed",
        description: "Failed to initiate Calendly OAuth flow",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    try {
      const redirectUri = `${window.location.origin}/calendly-oauth-callback`;
      
      const { data, error } = await supabase.functions.invoke('calendly-oauth-callback', {
        body: {
          code,
          state,
          redirect_uri: redirectUri
        }
      });

      if (error) throw error;

      toast({
        title: "Calendly Connected",
        description: "Successfully connected to Calendly",
      });

      return data;
      
    } catch (error) {
      console.error('OAuth callback failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to complete Calendly connection",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getConnections = useCallback(async (): Promise<CalendlyConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('calendly_connections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('Failed to get connections:', error);
      return [];
    }
  }, []);

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

  const disconnectConnection = useCallback(async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('calendly_connections')
        .update({ is_active: false })
        .eq('id', connectionId);

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

  const getWebhookEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('calendly_webhook_events')
        .select(`
          *,
          calendly_connections!inner(
            calendly_user_uri,
            calendly_organization_uri
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('Failed to get webhook events:', error);
      return [];
    }
  }, []);

  return {
    isLoading,
    initiateOAuth,
    handleOAuthCallback,
    getConnections,
    getAvailability,
    disconnectConnection,
    getWebhookEvents,
  };
};
