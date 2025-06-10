
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, Clock, TrendingUp, Target, Bot, User } from "lucide-react";
import { useState } from "react";
import { generateAIInsight } from "@/utils/aiService";

const getContextualQueries = (context?: string) => {
  switch (context) {
    case 'google-calendar':
      return [
        "What's my schedule looking like this week?",
        "When do I have free time for meetings?",
        "How many hours am I working this week?",
        "What meetings should I prioritize?",
        "Am I overbooked this week?",
        "When is my next available slot?"
      ];
    case 'trello':
      return [
        "Which cards need attention?",
        "What's blocking my progress?",
        "Which board has the most activity?",
        "What tasks are overdue?",
        "Show me high priority items",
        "What should I work on next?"
      ];
    default:
      return [
        "Which client has the longest open deal?",
        "What's likely to close this week?",
        "What should I follow up on today?",
        "Show me pipeline bottlenecks",
        "Which rep needs support?",
        "What's driving our growth this month?"
      ];
  }
};

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  aiResponse?: any;
}

interface AskAIPanelProps {
  context?: string;
}

export const AskAIPanel = ({ context }: AskAIPanelProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const suggestedQueries = getContextualQueries(context);
  const contextTitle = context === 'google-calendar' ? 'Calendar Assistant' : 
                     context === 'trello' ? 'Project Assistant' : 
                     'AI Assistant';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentQuery = query.trim();
    setQuery("");

    try {
      const contextualQuery = context ? `[${context.toUpperCase()} CONTEXT] ${currentQuery}` : currentQuery;
      const aiResponse = await generateAIInsight(contextualQuery);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
        aiResponse
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI query failed:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = async (suggestedQuery: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestedQuery,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const contextualQuery = context ? `[${context.toUpperCase()} CONTEXT] ${suggestedQuery}` : suggestedQuery;
      const aiResponse = await generateAIInsight(contextualQuery);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
        aiResponse
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI query failed:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          {contextTitle}
        </CardTitle>
        <CardDescription>
          {context === 'google-calendar' 
            ? 'Get insights about your calendar and schedule'
            : context === 'trello'
            ? 'Ask questions about your projects and tasks'
            : 'Get instant insights and answers about your sales data'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="mb-6">
            <ScrollArea className="h-80 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {chatHistory.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gradient-to-r from-purple-50 to-blue-50 border'
                      }`}>
                        {message.type === 'ai' && message.aiResponse && (
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{message.aiResponse.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {message.aiResponse.confidence}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        {message.type === 'ai' && message.aiResponse?.metadata?.metrics && (
                          <div className="flex gap-3 mt-2 text-xs">
                            {Object.entries(message.aiResponse.metadata.metrics).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                <span className="font-medium">{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {message.timestamp}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center order-2">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="max-w-[80%]">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Ask anything about your ${context === 'google-calendar' ? 'calendar' : context === 'trello' ? 'projects' : 'sales data'}...`}
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

        {chatHistory.length === 0 && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg text-center">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Start a conversation with your {contextTitle.toLowerCase()} to get insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
