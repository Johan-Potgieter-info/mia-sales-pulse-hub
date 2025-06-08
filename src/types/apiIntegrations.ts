
import { ReactNode } from 'react';

export interface APIIntegration {
  id: string;
  name: string;
  provider: string;
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
