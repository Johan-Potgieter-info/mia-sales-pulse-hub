
interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export class GoogleOAuthService {
  private config: GoogleOAuthConfig;

  constructor(clientId: string) {
    this.config = {
      clientId,
      redirectUri: `https://mia-sales-pulse-hub.lovable.app/oauth/google/callback`,
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    };
  }

  // Generate OAuth authorization URL
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      response_type: 'code',
      access_type: 'offline',
      include_granted_scopes: 'true',
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Start OAuth flow
  startOAuthFlow(): void {
    const authUrl = this.generateAuthUrl();
    window.location.href = authUrl;
  }

  // Exchange authorization code for access token (client-side)
  async exchangeCodeForToken(code: string, clientSecret: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.config.clientId,
        client_secret: clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OAuth token exchange failed: ${errorData}`);
    }

    return response.json();
  }

  // Generate random state for CSRF protection
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Parse callback URL for authorization code
  static parseCallbackUrl(url: string): { code?: string; error?: string; state?: string } {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    return {
      code: params.get('code') || undefined,
      error: params.get('error') || undefined,
      state: params.get('state') || undefined
    };
  }
}
