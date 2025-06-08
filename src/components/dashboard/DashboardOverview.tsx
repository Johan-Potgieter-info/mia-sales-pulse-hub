
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Clock, Calendar, Download } from "lucide-react";
import { KPICard } from "./KPICard";
import { SalesChart } from "./SalesChart";
import { PipelineChart } from "./PipelineChart";
import { LeadSourceChart } from "./LeadSourceChart";

export const DashboardOverview = () => {
  const kpiData = [
    {
      title: "Appointments Booked",
      value: "127",
      change: 12.5,
      icon: Calendar,
      description: "This month vs last month"
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: -2.1,
      icon: Target,
      description: "Lead to customer conversion"
    },
    {
      title: "Deal Value",
      value: "R 486K",
      change: 18.2,
      icon: DollarSign,
      description: "Total pipeline value"
    },
    {
      title: "Sales Cycle",
      value: "32 days",
      change: -5.3,
      icon: Clock,
      description: "Average time to close"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <LeadSourceChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PipelineChart />
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New deal closed - Acme Corp</p>
                <p className="text-xs text-muted-foreground">R 45,000 • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Meeting scheduled with Tech Solutions</p>
                <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Follow-up required - Global Industries</p>
                <p className="text-xs text-muted-foreground">Overdue by 1 day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
