
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Sparkles, Clock, TrendingUp, Target } from "lucide-react";
import { useState } from "react";
import { generateAIInsight } from "@/utils/aiService";

const suggestedQueries = [
  "Which client has the longest open deal?",
  "What's likely to close this week?",
  "What should I follow up on today?",
  "Show me pipeline bottlenecks",
  "Which rep needs support?",
  "What's driving our growth this month?"
];

export const AskAIPanel = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const aiResponse = await generateAIInsight(query);
      setResponse(aiResponse);
      setQuery("");
    } catch (error) {
      console.error("AI query failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = async (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setIsLoading(true);
    try {
      const aiResponse = await generateAIInsight(suggestedQuery);
      setResponse(aiResponse);
      setQuery("");
    } catch (error) {
      console.error("AI query failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          Ask AI Assistant
        </CardTitle>
        <CardDescription>
          Get instant insights and answers about your sales data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything about your sales data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Suggested queries:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestedQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1 px-2"
                  onClick={() => handleSuggestedQuery(suggestedQuery)}
                  disabled={isLoading}
                >
                  {suggestedQuery}
                </Button>
              ))}
            </div>
          </div>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{response.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {response.confidence} Confidence
                  </Badge>
                  <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {response.content}
                </p>
                {response.metadata?.metrics && (
                  <div className="flex gap-4 text-xs">
                    {Object.entries(response.metadata.metrics).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
