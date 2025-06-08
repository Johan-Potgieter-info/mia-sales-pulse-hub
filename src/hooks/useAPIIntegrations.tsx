
import { useState, useCallback } from 'react';
import { Calendar, Database, Trello, FileText, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface APIIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'warning';
  lastSync: string;
  description: string;
  icon: React.ReactNode;
  metrics?: Record<string, string | number>;
  category: string;
}

const mockIntegrations: APIIntegration[] = [
  {
    id: 'calendly',
    name: 'Calendly',
    status: 'connected',
    lastSync: '2 minutes ago',
    description: 'Meeting scheduling and analytics',
    icon: <Calendar className="w-4 h-4 text-blue-500" />,
    metrics: {
      'Meetings': 127,
      'Conversion': '24.8%'
    },
    category: 'calendar'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    status: 'connected',
    lastSync: '5 minutes ago',
    description: 'Document storage and collaboration',
    icon: <Database className="w-4 h-4 text-green-500" />,
    metrics: {
      'Documents': 234,
      'Shared': 45
    },
    category: 'storage'
  },
  {
    id: 'trello',
    name: 'Trello',
    status: 'warning',
    lastSync: '1 hour ago',
    description: 'Project management and task tracking',
    icon: <Trello className="w-4 h-4 text-orange-500" />,
    metrics: {
      'Boards': 12,
      'Cards': 89
    },
    category: 'project'
  },
  {
    id: 'notion',
    name: 'Notion',
    status: 'error',
    lastSync: 'Failed',
    description: 'Knowledge management and documentation',
    icon: <FileText className="w-4 h-4 text-gray-500" />,
    metrics: {
      'Pages': 0,
      'Error': 'Auth'
    },
    category: 'knowledge'
  },
  {
    id: 'slack',
    name: 'Slack',
    status: 'disconnected',
    lastSync: 'Never',
    description: 'Team communication and notifications',
    icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
    category: 'communication'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    status: 'connected',
    lastSync: '10 minutes ago',
    description: 'Workflow automation and integrations',
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    metrics: {
      'Zaps': 8,
      'Runs': 1247
    },
    category: 'automation'
  }
];

export const useAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>(mockIntegrations);
  const { toast } = useToast();

  const refreshIntegration = useCallback(async (integrationId: string) => {
    toast({
      title: "Syncing...",
      description: "Refreshing integration data",
    });

    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, lastSync: 'Just now', status: 'connected' as const }
            : integration
        )
      );
      
      toast({
        title: "Sync Complete",
        description: "Integration data updated successfully",
      });
    }, 1500);
  }, [toast]);

  const addIntegration = useCallback((newIntegration: Omit<APIIntegration, 'id'>) => {
    const integration: APIIntegration = {
      ...newIntegration,
      id: Date.now().toString(),
    };
    
    setIntegrations(prev => [...prev, integration]);
    
    toast({
      title: "Integration Added",
      description: `${newIntegration.name} has been connected successfully`,
    });
  }, [toast]);

  return {
    integrations,
    refreshIntegration,
    addIntegration
  };
};
