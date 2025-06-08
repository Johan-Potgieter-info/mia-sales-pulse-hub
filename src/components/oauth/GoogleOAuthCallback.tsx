
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { GoogleOAuthService } from '@/services/googleOAuthService';
import { useAPIIntegrations } from '@/hooks/useAPIIntegrations';
import { useToast } from '@/hooks/use-toast';

export const GoogleOAuthCallback = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');
  const navigate = useNavigate();
  const { connectGoogleCalendar } = useAPIIntegrations();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const currentUrl = window.location.href;
        const { code, error } = GoogleOAuthService.parseCallbackUrl(currentUrl);

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setMessage('Exchanging authorization code for access token...');

        // Note: In a real application, you would need your client secret
        // For security, this should be handled by your backend
        // For now, we'll need the user to provide their client secret
        const clientSecret = localStorage.getItem('google_client_secret');
        if (!clientSecret) {
          throw new Error('Client secret not found. Please configure your Google OAuth credentials.');
        }

        const clientId = localStorage.getItem('google_client_id');
        if (!clientId) {
          throw new Error('Client ID not found. Please configure your Google OAuth credentials.');
        }

        const oauthService = new GoogleOAuthService(clientId);
        const tokenResponse = await oauthService.exchangeCodeForToken(code, clientSecret);

        setMessage('Connecting to Google Calendar...');
        await connectGoogleCalendar(tokenResponse.access_token);

        setStatus('success');
        setMessage('Successfully connected to Google Calendar!');

        // Redirect to integrations page after success
        setTimeout(() => {
          navigate('/?tab=integrations');
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        
        toast({
          title: "OAuth Error",
          description: error instanceof Error ? error.message : 'Failed to complete OAuth flow',
          variant: "destructive"
        });

        // Redirect back to integrations page after error
        setTimeout(() => {
          navigate('/?tab=integrations');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [connectGoogleCalendar, navigate, toast]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getAlertVariant = () => {
    switch (status) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle>Google OAuth</CardTitle>
          <CardDescription>
            {status === 'processing' && 'Processing your authorization...'}
            {status === 'success' && 'Authorization successful!'}
            {status === 'error' && 'Authorization failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={getAlertVariant()}>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
          
          {status === 'success' && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Redirecting you back to the integrations page...
            </p>
          )}
          
          {status === 'error' && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              You will be redirected back to try again...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
