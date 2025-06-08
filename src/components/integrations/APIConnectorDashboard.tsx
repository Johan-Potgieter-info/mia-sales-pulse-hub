
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Calendar, Database, Settings, RefreshCw, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

export const APIConnectorDashboard = () => {
  const { integrations, refreshIntegration, disconnectIntegration, isLoading } = useAPIIntegrations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      connected: { variant: 'default' as const, emoji: '🟢', text: 'Connected' },
      error: { variant: 'destructive' as const, emoji: '🔴', text: 'Error' },
      syncing: { variant: 'secondary' as const, emoji: '🟠', text: 'Syncing' },
      disconnected: { variant: 'outline' as const, emoji: '⚫', text: 'Disconnected' }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.disconnected;
    
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.emoji} {statusConfig.text}
      </Badge>
    );
  };

  if (integrations.length === 0) {
    return (
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-green-500" />
          Connected APIs ({integrations.length})
        </CardTitle>
        <CardDescription>
          Real-time data from your authenticated API connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {integration.icon}
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                  </div>
                  {getStatusIcon(integration.status)}
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(integration.status)}
                  <span className="text-xs text-muted-foreground">
                    {integration.lastSync || 'Never synced'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {integration.description}
                  </div>

                  {/* Show error message if connection failed */}
                  {integration.status === 'error' && integration.errorMessage && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {integration.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {integration.metrics && Object.keys(integration.metrics).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(integration.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => refreshIntegration(integration.id)}
                      disabled={isLoading || integration.status === 'syncing'}
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      {integration.status === 'syncing' ? 'Syncing...' : 'Sync'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => disconnectIntegration(integration.id)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
