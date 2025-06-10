import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRefreshCache = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshCache = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('refresh-cache');
      if (error) throw error;
      toast({
        title: 'Cache Refreshed',
        description: 'The cache has been cleared successfully.',
      });
    } catch (error) {
      console.error('Failed to refresh cache:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Unable to refresh cache.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  return { isRefreshing, refreshCache };
};
