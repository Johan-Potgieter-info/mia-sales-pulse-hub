
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Clock, AlertTriangle, Target, DollarSign } from "lucide-react";

interface ForecastItem {
  id: string;
  title: string;
  prediction: string;
  confidence: 'High' | 'Medium' | 'Low';
  trend: 'up' | 'down' | 'stable';
  value: string;
  timeframe: string;
  category: 'deals' | 'pipeline' | 'activity' | 'revenue';
  actionable: boolean;
}

const mockForecasts: ForecastItem[] = [
  {
    id: '1',
    title: 'Deal Closure Probability',
    prediction: '12 deals likely to close this week',
    confidence: 'High',
    trend: 'up',
    value: 'R 486K',
    timeframe: 'Next 7 days',
    category: 'deals',
    actionable: true
  },
  {
    id: '2',
    title: 'Pipeline Bottleneck Alert',
    prediction: 'Proposal stage showing 5-day delay',
    confidence: 'Medium',
    trend: 'down',
    value: '15 deals',
    timeframe: 'Current',
    category: 'pipeline',
    actionable: true
  },
  {
    id: '3',
    title: 'Revenue Projection',
    prediction: 'Monthly target 85% achievable',
    confidence: 'High',
    trend: 'up',
    value: 'R 742K',
    timeframe: 'End of month',
    category: 'revenue',
    actionable: false
  },
  {
    id: '4',
    title: 'Client Inactivity Warning',
    prediction: '8 clients with no contact for 14+ days',
    confidence: 'High',
    trend: 'stable',
    value: '8 clients',
    timeframe: 'Immediate',
    category: 'activity',
    actionable: true
  }
];

export const ForecastPanel = () => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deals': return <Target className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'pipeline': return <TrendingUp className="w-4 h-4" />;
      case 'activity': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          AI Forecast & Predictions
        </CardTitle>
        <CardDescription>
          Machine learning insights and predictions based on your integrated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockForecasts.map((forecast) => (
            <div key={forecast.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(forecast.category)}
                  <h4 className="font-semibold">{forecast.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(forecast.trend)}
                  <Badge className={getConfidenceColor(forecast.confidence)}>
                    {forecast.confidence}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {forecast.prediction}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-primary">{forecast.value}</span>
                  <span className="text-muted-foreground">{forecast.timeframe}</span>
                </div>
                
                {forecast.actionable && (
                  <Badge variant="outline" className="text-xs">
                    Action Required
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Overall Forecast Confidence</span>
          </div>
          <Progress value={78} className="mb-2" />
          <p className="text-sm text-blue-700">
            78% confidence in current predictions based on 6 integrated data sources
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
