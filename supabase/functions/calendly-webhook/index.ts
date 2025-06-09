
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, calendly-webhook-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook signature
    const signature = req.headers.get('calendly-webhook-signature');
    const webhookSecret = Deno.env.get('CALENDLY_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      return new Response('Webhook signature missing', { status: 401 });
    }

    const body = await req.text();
    
    // Verify signature using HMAC SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );

    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignatureHex) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log('Received webhook:', payload);

    // Find the connection based on the webhook payload
    const { data: connections } = await supabaseClient
      .from('calendly_connections')
      .select('*')
      .eq('is_active', true);

    let targetConnection = null;
    for (const connection of connections || []) {
      if (payload.payload?.organization && 
          connection.calendly_organization_uri === payload.payload.organization) {
        targetConnection = connection;
        break;
      }
    }

    if (!targetConnection) {
      console.error('No matching connection found for webhook');
      return new Response('Connection not found', { status: 404 });
    }

    // Store webhook event
    const { error: webhookError } = await supabaseClient
      .from('calendly_webhook_events')
      .insert({
        calendly_connection_id: targetConnection.id,
        calendly_webhook_uuid: payload.id,
        event_type: payload.event,
        calendly_event_uri: payload.payload?.event?.uri,
        calendly_invitee_uri: payload.payload?.invitee?.uri,
        payload: payload,
        status: 'pending',
      });

    if (webhookError) {
      console.error('Failed to store webhook event:', webhookError);
      return new Response('Database error', { status: 500 });
    }

    // Process webhook based on event type
    switch (payload.event) {
      case 'invitee.created':
        await processInviteeCreated(supabaseClient, payload, targetConnection.id);
        break;
      case 'invitee.canceled':
        await processInviteeCanceled(supabaseClient, payload, targetConnection.id);
        break;
      default:
        console.log(`Unhandled event type: ${payload.event}`);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});

async function processInviteeCreated(supabaseClient: any, payload: any, connectionId: string) {
  try {
    // Mark webhook as processing
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ status: 'processing' })
      .eq('calendly_webhook_uuid', payload.id);

    // Here you can add your business logic for when an invitee is created
    console.log('Processing invitee created:', payload.payload?.invitee);
    
    // Example: Update analytics, send notifications, etc.
    
    // Mark webhook as done
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ 
        status: 'done',
        processed_at: new Date().toISOString()
      })
      .eq('calendly_webhook_uuid', payload.id);

  } catch (error) {
    console.error('Error processing invitee.created:', error);
    
    // Mark webhook as failed and increment retry count
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ 
        status: 'failed',
        retry_count: supabaseClient.literal('retry_count + 1')
      })
      .eq('calendly_webhook_uuid', payload.id);
  }
}

async function processInviteeCanceled(supabaseClient: any, payload: any, connectionId: string) {
  try {
    // Mark webhook as processing
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ status: 'processing' })
      .eq('calendly_webhook_uuid', payload.id);

    // Here you can add your business logic for when an invitee cancels
    console.log('Processing invitee canceled:', payload.payload?.invitee);
    
    // Example: Update analytics, send cancellation notifications, etc.
    
    // Mark webhook as done
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ 
        status: 'done',
        processed_at: new Date().toISOString()
      })
      .eq('calendly_webhook_uuid', payload.id);

  } catch (error) {
    console.error('Error processing invitee.canceled:', error);
    
    // Mark webhook as failed and increment retry count
    await supabaseClient
      .from('calendly_webhook_events')
      .update({ 
        status: 'failed',
        retry_count: supabaseClient.literal('retry_count + 1')
      })
      .eq('calendly_webhook_uuid', payload.id);
  }
}
