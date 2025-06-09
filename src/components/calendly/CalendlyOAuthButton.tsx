
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { useCalendlyOAuth } from "@/hooks/integrations/calendly/useCalendlyOAuth";

interface CalendlyOAuthButtonProps {
  onSuccess?: () => void;
}

export const CalendlyOAuthButton = ({ onSuccess }: CalendlyOAuthButtonProps) => {
  const { isLoading, initiateOAuth } = useCalendlyOAuth();

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
