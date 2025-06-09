
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AvailabilityRequest {
  event_type_uri: string;
  start_time: string;
  end_time: string;
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

    const { event_type_uri, start_time, end_time }: AvailabilityRequest = await req.json();

    // Check cache first
    const startDate = new Date(start_time).toISOString().split('T')[0];
    const endDate = new Date(end_time).toISOString().split('T')[0];

    const { data: cachedData } = await supabaseClient
      .from('calendly_availability_cache')
      .select('availability_data')
      .eq('event_type_uri', event_type_uri)
      .eq('date_range_start', startDate)
      .eq('date_range_end', endDate)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedData) {
      return new Response(JSON.stringify(cachedData.availability_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get connection for this event type
    const { data: connection } = await supabaseClient
      .from('calendly_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!connection) {
      return new Response(JSON.stringify({ error: 'No active Calendly connection' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt access token
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
      ['decrypt']
    );

    const tokenData = new Uint8Array(connection.access_token);
    const iv = tokenData.slice(0, 12);
    const encrypted = tokenData.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    const accessToken = new TextDecoder().decode(decrypted);

    // Fetch availability from Calendly API v2
    const availabilityUrl = new URL('https://api.calendly.com/event_type_available_times');
    availabilityUrl.searchParams.set('event_type', event_type_uri);
    availabilityUrl.searchParams.set('start_time', start_time);
    availabilityUrl.searchParams.set('end_time', end_time);

    const response = await fetch(availabilityUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Calendly API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch availability' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const availabilityData = await response.json();

    // Cache the response
    await supabaseClient
      .from('calendly_availability_cache')
      .insert({
        event_type_uri,
        date_range_start: startDate,
        date_range_end: endDate,
        availability_data: availabilityData,
      });

    return new Response(JSON.stringify(availabilityData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Availability fetch error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
