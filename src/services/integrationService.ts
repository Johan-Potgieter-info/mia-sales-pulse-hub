
import { supabase } from "@/integrations/supabase/client";
import { credentialsService } from "./credentialsService";
import { DatabaseAPIIntegration } from "@/types/database";

export type { DatabaseAPIIntegration };

export const integrationService = {
  // Create a new integration
  async createIntegration(
    name: string,
    provider: string,
    category: string,
    credentials: Record<string, string>
  ): Promise<DatabaseAPIIntegration> {
    const { data: integration, error } = await (supabase as any)
      .from('api_integrations')
      .insert({
        name,
        provider,
        category,
        status: 'connected',
        has_data: false
      })
      .select()
      .single();

    if (error) throw error;
    if (!integration) throw new Error('Failed to create integration');

    // Store credentials separately
    for (const [type, value] of Object.entries(credentials)) {
      await credentialsService.storeCredential(integration.id, type as any, value);
    }

    return integration as DatabaseAPIIntegration;
  },

  // Get all integrations for the current user
  async getUserIntegrations(): Promise<DatabaseAPIIntegration[]> {
    const { data, error } = await (supabase as any)
      .from('api_integrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DatabaseAPIIntegration[];
  },

  // Update integration status
  async updateIntegrationStatus(
    integrationId: string, 
    status: DatabaseAPIIntegration['status'],
    hasData?: boolean
  ) {
    const updateData: any = { 
      status,
      last_sync: new Date().toISOString()
    };
    
    if (hasData !== undefined) {
      updateData.has_data = hasData;
    }

    const { error } = await (supabase as any)
      .from('api_integrations')
      .update(updateData)
      .eq('id', integrationId);

    if (error) throw error;
  },

  // Delete an integration and its credentials
  async deleteIntegration(integrationId: string) {
    // Credentials will be deleted automatically due to CASCADE
    const { error } = await (supabase as any)
      .from('api_integrations')
      .delete()
      .eq('id', integrationId);

    if (error) throw error;
  },

  // Store integration data
  async storeIntegrationData(
    integrationId: string,
    dataType: string,
    data: any
  ) {
    const { error } = await (supabase as any)
      .from('integration_data')
      .insert({
        integration_id: integrationId,
        data_type: dataType,
        data: data
      });

    if (error) throw error;

    // Update integration to mark it as having data
    await this.updateIntegrationStatus(integrationId, 'connected', true);
  },

  // Get integration data
  async getIntegrationData(integrationId: string, dataType?: string) {
    let query = (supabase as any)
      .from('integration_data')
      .select('*')
      .eq('integration_id', integrationId);

    if (dataType) {
      query = query.eq('data_type', dataType);
    }

    const { data, error } = await query.order('synced_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
