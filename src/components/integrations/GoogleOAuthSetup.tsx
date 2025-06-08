
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key } from 'lucide-react';
import { GoogleOAuthService } from '@/services/googleOAuthService';

interface GoogleOAuthSetupProps {
  onStartOAuth: () => void;
}

export const GoogleOAuthSetup = ({ onStartOAuth }: GoogleOAuthSetupProps) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartOAuth = () => {
    if (!clientId.trim()) {
      alert('Please enter your Google Client ID');
      return;
    }

    if (!clientSecret.trim()) {
      alert('Please enter your Google Client Secret');
      return;
    }

    // Store credentials in localStorage for the OAuth flow
    localStorage.setItem('google_client_id', clientId);
    localStorage.setItem('google_client_secret', clientSecret);

    // Start OAuth flow
    const oauthService = new GoogleOAuthService(clientId);
    oauthService.startOAuthFlow();
    
    onStartOAuth();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Google OAuth Setup
        </CardTitle>
        <CardDescription>
          Configure your Google OAuth credentials to connect to Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Important:</strong> Make sure to add <code>https://mia-sales-pulse-hub.lovable.app/oauth/google/callback</code> as an authorized redirect URI in your Google Cloud Console.
          </AlertDescription>
        </Alert>

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

        <div className="flex gap-2">
          <Button onClick={handleStartOAuth} className="flex-1">
            Connect Google Calendar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Setup Guide
          </Button>
        </div>

        {showInstructions && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Setup Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console - Credentials</a></li>
                  <li>Create a new OAuth 2.0 Client ID (Web application)</li>
                  <li>Add <code>https://mia-sales-pulse-hub.lovable.app/oauth/google/callback</code> to Authorized redirect URIs</li>
                  <li>Copy the Client ID and Client Secret to the fields above</li>
                  <li>Enable the Google Calendar API in your project</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
