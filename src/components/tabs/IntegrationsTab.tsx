
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Database, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

export const IntegrationsTab = () => {
  const [showAddAPIModal, setShowAddAPIModal] = useState(false);
  
  // Simplified mock data to avoid dependency issues
  const integrations: any[] = [];
  const realTimeData = {};
  
  const hasConnectedAPIs = integrations.length > 0;
  const hasAIIntegration = integrations.some((int: any) => int.category === 'ai');
  const hasDataForInsights = false;

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

      {/* Simplified API Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Connected APIs
          </CardTitle>
          <CardDescription>
            No APIs connected yet. Start by connecting your first API to see real data.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <WifiOff className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Connected APIs</h3>
          <p className="text-muted-foreground mb-4">
            Connect your first API to start seeing real-time data and insights
          </p>
          <Button onClick={() => setShowAddAPIModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Connect API
          </Button>
        </CardContent>
      </Card>

      {/* AI Features Placeholder */}
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

      {/* Simple Modal Placeholder */}
      {showAddAPIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Connect API</CardTitle>
              <CardDescription>API connection modal coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAddAPIModal(false)} 
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
