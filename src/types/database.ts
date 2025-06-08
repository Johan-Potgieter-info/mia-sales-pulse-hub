
export interface DatabaseAPIIntegration {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  category: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  has_data: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAPICredential {
  id: string;
  integration_id: string;
  credential_type: string;
  encrypted_value: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseIntegrationData {
  id: string;
  integration_id: string;
  data_type: string;
  data: any;
  synced_at: string;
  created_at: string;
}
