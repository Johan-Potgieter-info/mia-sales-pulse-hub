
import { useCalendlyOAuth } from './calendly/useCalendlyOAuth';
import { useCalendlyConnections } from './calendly/useCalendlyConnections';
import { useCalendlyAvailability } from './calendly/useCalendlyAvailability';
import { useCalendlyWebhooks } from './calendly/useCalendlyWebhooks';

// Re-export types for backward compatibility
export type { 
  CalendlyConnection, 
  CalendlyEventType, 
  CalendlyAvailableTime, 
  CalendlyAvailability 
} from '@/types/calendly';

export const useCalendlyV2API = () => {
  const { isLoading: oauthLoading, initiateOAuth, handleOAuthCallback } = useCalendlyOAuth();
  const { getConnections, disconnectConnection } = useCalendlyConnections();
  const { isLoading: availabilityLoading, getAvailability } = useCalendlyAvailability();
  const { getWebhookEvents } = useCalendlyWebhooks();

  const isLoading = oauthLoading || availabilityLoading;

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
