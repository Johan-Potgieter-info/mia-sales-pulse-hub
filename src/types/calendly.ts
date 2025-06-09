
export interface CalendlyConnection {
  id: string;
  calendly_user_uri: string;
  calendly_organization_uri: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  duration: number;
  scheduling_url: string;
  active: boolean;
  kind: string;
  description_plain?: string;
}

export interface CalendlyAvailableTime {
  start_time: string;
  invitee_start_time: string;
}

export interface CalendlyAvailability {
  collection: CalendlyAvailableTime[];
}

export interface CalendlyWebhookEvent {
  id: string;
  event_type: string;
  calendly_event_uri?: string;
  calendly_invitee_uri?: string;
  payload: any;
  created_at: string;
  processed_at?: string;
}
