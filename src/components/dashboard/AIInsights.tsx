
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

const mockInsights = [
  {
    type: "trend",
    icon: TrendingUp,
    title: "Revenue Growth Acceleration",
    content: "Your June revenue is 18% above forecast. The main drivers are increased conversion rates from referral sources and shorter sales cycles.",
    timestamp: "2 hours ago",
    confidence: "High"
  },
  {
    type: "alert",
    icon: AlertTriangle,
    title: "Pipeline Bottleneck Detected",
    content: "Deals are accumulating in the 'Proposal' stage. Consider reviewing proposal templates or offering more competitive pricing.",
    timestamp: "5 hours ago",
    confidence: "Medium"
  },
  {
    type: "insight",
    icon: Lightbulb,
    title: "Optimization Opportunity",
    content: "Website leads convert 15% better than other sources. Consider increasing marketing spend on SEO and content marketing.",
    timestamp: "1 day ago",
    confidence: "High"
  }
];

export const AIInsights = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = () => {
    if (!question.trim()) return;
    setIsLoading(true);
    // Simulate AI response delay
    setTimeout(() => {
      setIsLoading(false);
      setQuestion("");
    }, 2000);
  };

  const exampleQuestions = [
    "What changed this month?",
    "Why did conversions drop?",
    "Which sales rep is performing best?",
    "How can I improve my pipeline?"
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <CardTitle>AI Sales Insights</CardTitle>
        </div>
        <CardDescription>
          Get intelligent analysis and recommendations for your sales performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ask AI Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask AI about your sales data..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <Button 
              onClick={handleAskAI} 
              disabled={isLoading || !question.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setQuestion(q)}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recent Insights */}
        <div className="space-y-4">
          <h4 className="font-medium">Recent Insights</h4>
          {mockInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className="p-4 rounded-lg border bg-muted/20">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'trend' ? 'text-green-500' :
                    insight.type === 'alert' ? 'text-orange-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{insight.title}</h5>
                      <Badge 
                        variant={insight.confidence === 'High' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {insight.confidence} confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.content}</p>
                    <p className="text-xs text-muted-foreground">{insight.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
