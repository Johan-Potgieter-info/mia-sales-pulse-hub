
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Calendar, Phone, Mail, FileText, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'follow-up' | 'meeting' | 'task' | 'outreach';
  source: string;
  actionable: boolean;
  completed?: boolean;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Follow up with Global Industries',
    description: 'No contact for 10 days, proposal sent',
    priority: 'high',
    type: 'follow-up',
    source: 'Trello + Calendar',
    actionable: true
  },
  {
    id: '2',
    title: 'Schedule demo with Tech Solutions',
    description: 'Calendar gap tomorrow 2-4 PM available',
    priority: 'medium',
    type: 'meeting',
    source: 'Calendly',
    actionable: true
  },
  {
    id: '3',
    title: 'Update proposal for Acme Corp',
    description: 'Document not opened in 5 days',
    priority: 'medium',
    type: 'task',
    source: 'Google Drive',
    actionable: true
  },
  {
    id: '4',
    title: 'Reach out to warm leads',
    description: '3 website leads from last week',
    priority: 'low',
    type: 'outreach',
    source: 'Analytics',
    actionable: true
  }
];

export const SmartSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow-up': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'task': return <FileText className="w-4 h-4" />;
      case 'outreach': return <Mail className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const markCompleted = (id: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id 
          ? { ...suggestion, completed: true }
          : suggestion
      )
    );
  };

  const activeSuggestions = suggestions.filter(s => !s.completed);
  const completedCount = suggestions.filter(s => s.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on your data patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(suggestion.type)}
                  <span className="font-medium text-sm">{suggestion.title}</span>
                </div>
                <Badge className={getPriorityColor(suggestion.priority)}>
                  {suggestion.priority}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {suggestion.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  From: {suggestion.source}
                </span>
                
                {suggestion.actionable && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markCompleted(suggestion.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Done
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {activeSuggestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>All suggestions completed!</p>
              <p className="text-xs">Check back later for new insights.</p>
            </div>
          )}
        </div>
        
        {completedCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {completedCount} suggestions completed today
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
