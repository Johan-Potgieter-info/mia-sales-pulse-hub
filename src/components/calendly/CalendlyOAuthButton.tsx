
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { useCalendlyV2API } from "@/hooks/integrations/useCalendlyV2API";

interface CalendlyOAuthButtonProps {
  onSuccess?: () => void;
}

export const CalendlyOAuthButton = ({ onSuccess }: CalendlyOAuthButtonProps) => {
  const { isLoading, initiateOAuth } = useCalendlyV2API();

  const handleConnect = async () => {
    await initiateOAuth();
    onSuccess?.();
  };

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Calendar className="w-4 h-4" />
      )}
      {isLoading ? 'Connecting...' : 'Connect Calendly'}
    </Button>
  );
};
