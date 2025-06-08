
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Database, Wifi, WifiOff } from "lucide-react";
import { APIConnectorDashboard } from "@/components/integrations/APIConnectorDashboard";
import { RealAPIModal } from "@/components/integrations/RealAPIModal";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { useState } from "react";

export const IntegrationsTab = () => {
  const [showAddAPIModal, setShowAddAPIModal] = useState(false);
  const { integrations, realTimeData } = useAPIIntegrations();

  const hasConnectedAPIs = integrations.length > 0;
  const hasAIIntegration = integrations.some(int => int.category === 'ai');
  const hasDataForInsights = hasConnectedAPIs && (
    realTimeData.trello?.boards?.length > 0 || 
    realTimeData.googleCalendar?.events?.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">API Integration Center</h2>
          <p className="text-muted-foreground">
            {hasConnectedAPIs 
              ? `Manage your ${integrations.length} connected service${integrations.length !== 1 ? 's' : ''} and data sources`
              : 'Connect your first API to start seeing real-time data'
            }
          </p>
        </div>
        <Button onClick={() => setShowAddAPIModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Connect API
        </Button>
      </div>

      {/* Connection Status Banner */}
      <Card className={hasConnectedAPIs ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {hasConnectedAPIs ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-orange-600" />
            )}
            <div>
              <h3 className="font-semibold">
                {hasConnectedAPIs ? 'APIs Connected' : 'No APIs Connected'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasConnectedAPIs 
                  ? `${integrations.length} real data source${integrations.length !== 1 ? 's' : ''} active`
                  : 'Connect your first API to see real-time insights'
                }
              </p>
            </div>
          </div>
          {hasConnectedAPIs && (
            <Badge variant="default" className="bg-green-600">
              Live Data
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* API Connector Dashboard */}
      <APIConnectorDashboard />

      {/* AI-Powered Features - Only show if we have AI integration and data */}
      {hasAIIntegration && hasDataForInsights && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Simple placeholder for AI features since the original components may not exist */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Forecast Panel</CardTitle>
              <CardDescription>AI-powered forecasting and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">AI forecasting features coming soon...</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Smart Suggestions</CardTitle>
              <CardDescription>AI-generated recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Smart suggestions coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ask AI Panel - Only show if AI is connected */}
      {hasAIIntegration && (
        <Card>
          <CardHeader>
            <CardTitle>Ask AI</CardTitle>
            <CardDescription>Get insights from your data using AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a question about your data..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <Button>Ask</Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                <p className="text-muted-foreground">AI responses will appear here...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state for AI features */}
      {hasConnectedAPIs && !hasAIIntegration && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Database className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Features Available</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connect an AI API (OpenAI or Claude) to unlock forecasting, smart suggestions, and AI-powered insights.
            </p>
            <Button onClick={() => setShowAddAPIModal(true)} variant="outline">
              Connect AI API
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Real API Connection Modal */}
      <RealAPIModal 
        open={showAddAPIModal} 
        onOpenChange={setShowAddAPIModal} 
      />
    </div>
  );
};
