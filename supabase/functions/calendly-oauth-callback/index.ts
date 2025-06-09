
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OAuthCallbackRequest {
  code: string;
  state: string;
  redirect_uri: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { code, state, redirect_uri }: OAuthCallbackRequest = await req.json();

    // Verify and retrieve OAuth state
    const { data: oauthState, error: stateError } = await supabaseClient
      .from('calendly_oauth_states')
      .select('*')
      .eq('state', state)
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (stateError || !oauthState) {
      return new Response(JSON.stringify({ error: 'Invalid or expired state' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://auth.calendly.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: Deno.env.get('CALENDLY_CLIENT_ID')!,
        client_secret: Deno.env.get('CALENDLY_CLIENT_SECRET')!,
        redirect_uri,
        code,
        code_verifier: oauthState.code_verifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return new Response(JSON.stringify({ error: 'Token exchange failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tokens = await tokenResponse.json();

    // Get user info from Calendly
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to get user info' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userData = await userResponse.json();
    const calendlyUser = userData.resource;

    // Encrypt tokens before storage
    const encryptionKey = Deno.env.get('CALENDLY_ENCRYPTION_KEY');
    if (!encryptionKey) {
      return new Response(JSON.stringify({ error: 'Encryption key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const accessTokenEncrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(tokens.access_token)
    );

    let refreshTokenEncrypted = null;
    if (tokens.refresh_token) {
      refreshTokenEncrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(tokens.refresh_token)
      );
    }

    // Store connection in database
    const expiresAt = tokens.expires_in ? 
      new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null;

    const { error: connectionError } = await supabaseClient
      .from('calendly_connections')
      .upsert({
        user_id: user.id,
        calendly_user_uri: calendlyUser.uri,
        calendly_organization_uri: calendlyUser.current_organization,
        access_token: new Uint8Array([...iv, ...new Uint8Array(accessTokenEncrypted)]),
        refresh_token: refreshTokenEncrypted ? 
          new Uint8Array([...iv, ...new Uint8Array(refreshTokenEncrypted)]) : null,
        token_expires_at: expiresAt,
        scope: tokens.scope,
        is_active: true,
      }, {
        onConflict: 'user_id,calendly_user_uri'
      });

    if (connectionError) {
      console.error('Connection storage error:', connectionError);
      return new Response(JSON.stringify({ error: 'Failed to store connection' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean up OAuth state
    await supabaseClient
      .from('calendly_oauth_states')
      .delete()
      .eq('id', oauthState.id);

    return new Response(JSON.stringify({ 
      success: true,
      user: calendlyUser 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
