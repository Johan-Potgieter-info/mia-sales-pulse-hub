
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCalendlyOAuth = () => {
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

  return {
    isLoading,
    initiateOAuth,
    handleOAuthCallback,
  };
};
