
import { ReactNode } from 'react';

export interface APIIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string | null;
  description: string;
  icon: ReactNode;
  metrics?: Record<string, string | number>;
  category: string;
  apiKey?: string;
  accessToken?: string;
  hasData: boolean;
  errorMessage?: string;
}

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

export interface RealTimeData {
  trello?: {
    boards: any[];
    cards: any[];
  };
  googleCalendar?: {
    events: any[];
  };
  googleSheets?: {
    sheets: any[];
  };
  aiInsights?: {
    insights: any[];
  };
}

export type AIProvider = 'openai' | 'claude';
