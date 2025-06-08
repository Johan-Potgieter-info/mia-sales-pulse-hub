
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const leadSourceData = [
  { name: "Website", value: 35, color: "#0ea5e9" },
  { name: "Referrals", value: 28, color: "#10b981" },
  { name: "Social Media", value: 20, color: "#f59e0b" },
  { name: "Email Campaign", value: 12, color: "#ef4444" },
  { name: "Cold Outreach", value: 5, color: "#8b5cf6" },
];

export const LeadSourceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Where leads are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={leadSourceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {leadSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
