
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Info } from 'lucide-react';
import { GoogleOAuthService } from '@/services/googleOAuthService';

interface GoogleOAuthSetupProps {
  onStartOAuth: () => void;
}

export const GoogleOAuthSetup = ({ onStartOAuth }: GoogleOAuthSetupProps) => {
  const [clientId, setClientId] = useState(localStorage.getItem('google_client_id') || '');
  const [clientSecret, setClientSecret] = useState(localStorage.getItem('google_client_secret') || '');
  const [isConfigured, setIsConfigured] = useState(
    !!localStorage.getItem('google_client_id') && !!localStorage.getItem('google_client_secret')
  );

  const handleSaveCredentials = () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      alert('Please enter both Client ID and Client Secret');
      return;
    }

    localStorage.setItem('google_client_id', clientId.trim());
    localStorage.setItem('google_client_secret', clientSecret.trim());
    setIsConfigured(true);
  };

  const handleStartOAuth = () => {
    if (!isConfigured) {
      alert('Please configure your OAuth credentials first');
      return;
    }

    const oauthService = new GoogleOAuthService(clientId);
    oauthService.startOAuthFlow();
    onStartOAuth();
  };

  const getCurrentRedirectUri = () => {
    return `${window.location.origin}/oauth/google/callback`;
  };

  if (isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Google Calendar OAuth
          </CardTitle>
          <CardDescription>
            OAuth credentials configured. Ready to connect to Google Calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Redirect URI:</strong> {getCurrentRedirectUri()}
              <br />
              Make sure this URL is added to your Google OAuth configuration.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Click the button below to start the OAuth flow and authorize calendar access.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleStartOAuth} className="flex-1">
              Connect Google Calendar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsConfigured(false)}
            >
              Reconfigure
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📅 Google Calendar OAuth Setup
        </CardTitle>
        <CardDescription>
          Configure your Google OAuth credentials to connect to Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Required Redirect URI:</strong> {getCurrentRedirectUri()}
            <br />
            Add this to your Google Cloud Console OAuth configuration.
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <h4 className="font-medium">How to get Google OAuth credentials:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>
              Go to{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Create or select a project</li>
            <li>Enable the Google Calendar API</li>
            <li>Create OAuth 2.0 credentials (Web application)</li>
            <li>Add <code className="bg-gray-100 px-1 rounded">{getCurrentRedirectUri()}</code> to authorized redirect URIs</li>
            <li>Copy your Client ID and Client Secret below</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-id">Google Client ID</Label>
            <Input
              id="client-id"
              type="text"
              placeholder="Your Google OAuth Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-secret">Google Client Secret</Label>
            <Input
              id="client-secret"
              type="password"
              placeholder="Your Google OAuth Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>

          <Button onClick={handleSaveCredentials} className="w-full">
            Save OAuth Credentials
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
