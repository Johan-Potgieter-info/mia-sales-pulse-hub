
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, Calendar, Database, Trello, FileText, Settings, RefreshCw } from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

export const APIConnectorDashboard = () => {
  const { integrations, refreshIntegration } = useAPIIntegrations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      error: 'destructive',
      warning: 'secondary',
      disconnected: 'outline'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Connected APIs
        </CardTitle>
        <CardDescription>
          Manage your integrations and monitor sync status
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
                    {integration.lastSync}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {integration.description}
                  </div>
                  {integration.metrics && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(integration.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
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
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sync
                    </Button>
                    <Button size="sm" variant="ghost">
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
