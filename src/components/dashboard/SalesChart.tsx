
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: "Jan", revenue: 420000, forecast: 400000 },
  { month: "Feb", revenue: 380000, forecast: 420000 },
  { month: "Mar", revenue: 520000, forecast: 450000 },
  { month: "Apr", revenue: 480000, forecast: 480000 },
  { month: "May", revenue: 590000, forecast: 520000 },
  { month: "Jun", revenue: 620000, forecast: 580000 },
];

export const SalesChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>Revenue vs Forecast (ZAR)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `R${(value / 1000).toFixed(0)}K`} />
            <Tooltip 
              formatter={(value: number) => [`R${(value / 1000).toFixed(0)}K`, '']}
              labelStyle={{ color: '#000' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Actual Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecast"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
