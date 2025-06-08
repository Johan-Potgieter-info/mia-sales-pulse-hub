
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, BarChart3, Database, Trello, Download, TrendingUp, TrendingDown, Users, DollarSign, Target, Clock, Settings, Plug, Wifi, WifiOff } from "lucide-react";
import { KPICard } from "./KPICard";
import { SalesChart } from "./SalesChart";
import { PipelineChart } from "./PipelineChart";
import { LeadSourceChart } from "./LeadSourceChart";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

interface DashboardOverviewProps {
  onNavigateToIntegrations?: () => void;
}

export const DashboardOverview = ({ onNavigateToIntegrations }: DashboardOverviewProps) => {
  const { integrations, realTimeData } = useAPIIntegrations();
  const hasConnectedAPIs = integrations.length > 0;
  const connectedCount = integrations.filter(int => int.status === 'connected').length;
  
  // Mock data - in real app this would come from your APIs
  const mockData = {
    totalRevenue: 127500,
    newLeads: 142,
    conversionRate: 23.5,
    averageDealSize: 3200
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className={hasConnectedAPIs ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasConnectedAPIs ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-orange-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {hasConnectedAPIs ? `${connectedCount} API${connectedCount !== 1 ? 's' : ''} Connected` : 'No APIs Connected'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasConnectedAPIs 
                    ? 'Your dashboard is showing real-time data'
                    : 'Connect your APIs to see real sales data'
                  }
                </p>
              </div>
            </div>
            {!hasConnectedAPIs && (
              <Button onClick={onNavigateToIntegrations} className="flex items-center gap-2">
                <Plug className="w-4 h-4" />
                Connect APIs
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={`$${mockData.totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          description="Total revenue generated this month"
        />
        <KPICard
          title="New Leads"
          value={mockData.newLeads.toString()}
          change={8.2}
          icon={Users}
          description="Number of new leads acquired this month"
        />
        <KPICard
          title="Conversion Rate"
          value={`${mockData.conversionRate}%`}
          change={-2.1}
          icon={Target}
          description="Percentage of leads converted to customers"
        />
        <KPICard
          title="Avg Deal Size"
          value={`$${mockData.averageDealSize.toLocaleString()}`}
          change={5.7}
          icon={BarChart3}
          description="Average value of closed deals"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart />
        <PipelineChart />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <LeadSourceChart />
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={onNavigateToIntegrations}>
              <Plug className="w-4 h-4 mr-2" />
              {hasConnectedAPIs ? 'Manage Integrations' : 'Connect APIs'}
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled={!hasConnectedAPIs}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Empty State for No Data */}
      {!hasConnectedAPIs && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Database className="w-16 h-16 text-muted-foreground/50 mb-6" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Data Sources</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by connecting your APIs to see real sales data, analytics, and insights in your dashboard.
            </p>
            <Button onClick={onNavigateToIntegrations} size="lg" className="flex items-center gap-2">
              <Plug className="w-5 h-5" />
              Connect Your First API
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
