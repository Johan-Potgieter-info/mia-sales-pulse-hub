
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const pipelineData = [
  { stage: "Lead", count: 45, value: 180000 },
  { stage: "Qualified", count: 28, value: 420000 },
  { stage: "Proposal", count: 15, value: 360000 },
  { stage: "Negotiation", count: 8, value: 240000 },
  { stage: "Closed Won", count: 12, value: 480000 },
];

export const PipelineChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Pipeline</CardTitle>
        <CardDescription>Deals by stage</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'count' ? `${value} deals` : `R${(value / 1000).toFixed(0)}K`,
                name === 'count' ? 'Deals' : 'Value'
              ]}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
