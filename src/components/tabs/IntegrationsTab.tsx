
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { RealAPIModal } from "@/components/integrations/RealAPIModal";
import { APIConnectorDashboard } from "@/components/integrations/APIConnectorDashboard";
import { AskAIPanel } from "@/components/integrations/AskAIPanel";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

export const IntegrationsTab = () => {
  const [showAddAPIModal, setShowAddAPIModal] = useState(false);
  const { integrations } = useAPIIntegrations();
  
  const connectedIntegrations = integrations.filter(int => int.status === 'connected');
  const hasConnectedAPIs = connectedIntegrations.length > 0;
  const hasAIIntegration = connectedIntegrations.some((int) => int.category === 'ai');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">API Integration Center</h2>
          <p className="text-muted-foreground">
            {hasConnectedAPIs 
              ? `Manage your ${connectedIntegrations.length} connected service${connectedIntegrations.length !== 1 ? 's' : ''}`
              : 'Connect your first API to start seeing real-time data'
            }
          </p>
        </div>
        <Button onClick={() => setShowAddAPIModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Connect API
        </Button>
      </div>

      {/* Connection Status Banner - only show if there are connected APIs */}
      {hasConnectedAPIs && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold">APIs Connected</h3>
                <p className="text-sm text-muted-foreground">
                  {connectedIntegrations.length} real data source{connectedIntegrations.length !== 1 ? 's' : ''} active
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">
              Live Data
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* No APIs Connected State */}
      {!hasConnectedAPIs && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold">No APIs Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your first API to see real-time insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected APIs Dashboard - only show if there are connected APIs */}
      {hasConnectedAPIs && <APIConnectorDashboard />}

      {/* AI Assistant Panel - only show if AI is connected */}
      {hasAIIntegration && (
        <AskAIPanel />
      )}

      {/* Real API Modal */}
      <RealAPIModal 
        open={showAddAPIModal}
        onOpenChange={setShowAddAPIModal}
      />
    </div>
  );
};
