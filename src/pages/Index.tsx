
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, BarChart3, Database, Trello, Download, TrendingUp, TrendingDown, Users, DollarSign, Target, Clock, Settings, Plug, Wifi, WifiOff } from "lucide-react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CalendlyTab } from "@/components/tabs/CalendlyTab";
import { GoogleDriveTab } from "@/components/tabs/GoogleDriveTab";
import { TrelloTab } from "@/components/tabs/TrelloTab";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { IntegrationsTab } from "@/components/tabs/IntegrationsTab";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

const Index = () => {
  const { integrations } = useAPIIntegrations();
  const hasConnectedAPIs = integrations.length > 0;
  const connectedCount = integrations.filter(int => int.status === 'connected').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mia Sales Reporting Hub</h1>
            <p className="text-sm text-muted-foreground">
              {hasConnectedAPIs 
                ? `Real-time analytics from ${connectedCount} connected API${connectedCount !== 1 ? 's' : ''}`
                : 'Connect your APIs to see real-time sales analytics'
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={hasConnectedAPIs ? "default" : "outline"} 
              className={hasConnectedAPIs ? "bg-green-50 text-green-700 border-green-200" : ""}
            >
              {hasConnectedAPIs ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  {connectedCount} API{connectedCount !== 1 ? 's' : ''} Live
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  No APIs Connected
                </>
              )}
            </Badge>
            <Button variant="outline" size="sm" disabled={!hasConnectedAPIs}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="calendly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="drive" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Drive</span>
            </TabsTrigger>
            <TabsTrigger value="trello" className="flex items-center gap-2">
              <Trello className="w-4 h-4" />
              <span className="hidden sm:inline">Trello</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="calendly">
            <CalendlyTab />
          </TabsContent>

          <TabsContent value="drive">
            <GoogleDriveTab />
          </TabsContent>

          <TabsContent value="trello">
            <TrelloTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>
        </Tabs>

        {/* AI Insights Panel - Only show if AI is connected */}
        {integrations.some(int => int.category === 'ai') && <AIInsights />}
      </div>
    </div>
  );
};

export default Index;
