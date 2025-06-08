
import { GoogleOAuthSetup } from '@/components/integrations/GoogleOAuthSetup';

interface GoogleCalendarConnectionFormProps {
  onConnect: (accessToken: string) => Promise<void>;
  isLoading: boolean;
}

export const GoogleCalendarConnectionForm = ({ onConnect, isLoading }: GoogleCalendarConnectionFormProps) => {
  const handleStartOAuth = () => {
    // OAuth flow will handle the connection through the callback
    console.log('Starting OAuth flow...');
  };

  return (
    <div className="space-y-4">
      <GoogleOAuthSetup onStartOAuth={handleStartOAuth} />
    </div>
  );
};
