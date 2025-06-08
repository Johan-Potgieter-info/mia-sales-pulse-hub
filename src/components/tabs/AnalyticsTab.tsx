
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Download, Filter, Calendar } from "lucide-react";
import { useState } from "react";

const monthlyPerformance = [
  { month: "Jan", revenue: 420000, deals: 12, appointments: 45 },
  { month: "Feb", revenue: 380000, deals: 10, appointments: 38 },
  { month: "Mar", revenue: 520000, deals: 15, appointments: 52 },
  { month: "Apr", revenue: 480000, deals: 13, appointments: 48 },
  { month: "May", revenue: 590000, deals: 18, appointments: 61 },
  { month: "Jun", revenue: 620000, deals: 20, appointments: 67 },
];

const conversionFunnel = [
  { stage: "Visitors", count: 2400, percentage: 100 },
  { stage: "Leads", count: 720, percentage: 30 },
  { stage: "Qualified", count: 216, percentage: 9 },
  { stage: "Proposals", count: 108, percentage: 4.5 },
  { stage: "Customers", count: 32, percentage: 1.3 }
];

const sourcePerformance = [
  { source: "Website", leads: 156, conversions: 32, rate: 20.5, color: "#0ea5e9" },
  { source: "Referrals", leads: 89, conversions: 28, rate: 31.5, color: "#10b981" },
  { source: "Social Media", leads: 67, conversions: 12, rate: 17.9, color: "#f59e0b" },
  { source: "Email", leads: 45, conversions: 8, rate: 17.8, color: "#ef4444" },
  { source: "Cold Outreach", leads: 23, conversions: 3, rate: 13.0, color: "#8b5cf6" }
];

export const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [metric, setMetric] = useState("revenue");

  const exportReport = () => {
    // Simulate PDF export
    console.log("Exporting analytics report...");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="deals">Deals</SelectItem>
              <SelectItem value="appointments">Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportReport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Monthly trends for {metric}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => 
                metric === 'revenue' ? `R${(value / 1000).toFixed(0)}K` : value.toString()
              } />
              <Tooltip 
                formatter={(value: number) => [
                  metric === 'revenue' ? `R${(value / 1000).toFixed(0)}K` : value,
                  metric.charAt(0).toUpperCase() + metric.slice(1)
                ]}
              />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel & Source Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead progression through sales stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{stage.count.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{stage.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
            <CardDescription>Lead conversion by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourcePerformance.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <div className="font-medium">{source.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.leads} leads → {source.conversions} conversions
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={source.rate > 25 ? "default" : source.rate > 15 ? "secondary" : "outline"}
                  >
                    {source.rate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Acquisition Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 2,450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↓ 12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 18,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
