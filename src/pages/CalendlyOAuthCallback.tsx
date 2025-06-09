
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCalendlyOAuth } from "@/hooks/integrations/calendly/useCalendlyOAuth";

export const CalendlyOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { handleOAuthCallback } = useCalendlyOAuth();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setErrorMessage(`OAuth error: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Missing required OAuth parameters');
        return;
      }

      try {
        await handleOAuthCallback(code, state);
        setStatus('success');
        
        // Redirect to main page after success
        setTimeout(() => {
          navigate('/?tab=calendly');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to complete OAuth flow');
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
            {status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            
            {status === 'loading' && 'Connecting to Calendly...'}
            {status === 'success' && 'Successfully Connected!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we complete your Calendly connection.'}
            {status === 'success' && 'Your Calendly account has been connected. Redirecting...'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
