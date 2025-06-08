
import { supabase } from "@/integrations/supabase/client";

// Simple encryption/decryption for demo purposes
// In production, you'd want to use a more robust encryption method
const encryptValue = (value: string): string => {
  return btoa(value); // Base64 encoding for demo
};

const decryptValue = (encryptedValue: string): string => {
  return atob(encryptedValue); // Base64 decoding for demo
};

export interface APICredential {
  id: string;
  integration_id: string;
  credential_type: string;
  encrypted_value: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const credentialsService = {
  // Store encrypted credentials
  async storeCredential(
    integrationId: string,
    credentialType: 'api_key' | 'access_token' | 'refresh_token' | 'client_id' | 'client_secret',
    value: string,
    expiresAt?: Date
  ) {
    const encryptedValue = encryptValue(value);
    
    const { data, error } = await supabase
      .from('api_credentials')
      .upsert({
        integration_id: integrationId,
        credential_type: credentialType,
        encrypted_value: encryptedValue,
        expires_at: expiresAt?.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Retrieve and decrypt credentials
  async getCredential(integrationId: string, credentialType: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('integration_id', integrationId)
      .eq('credential_type', credentialType)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return decryptValue(data.encrypted_value);
  },

  // Get all credentials for an integration
  async getIntegrationCredentials(integrationId: string): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('api_credentials')
      .select('credential_type, encrypted_value')
      .eq('integration_id', integrationId);

    if (error) throw error;
    if (!data) return {};

    const credentials: Record<string, string> = {};
    data.forEach(cred => {
      credentials[cred.credential_type] = decryptValue(cred.encrypted_value);
    });

    return credentials;
  },

  // Delete credentials for an integration
  async deleteIntegrationCredentials(integrationId: string) {
    const { error } = await supabase
      .from('api_credentials')
      .delete()
      .eq('integration_id', integrationId);

    if (error) throw error;
  }
};
