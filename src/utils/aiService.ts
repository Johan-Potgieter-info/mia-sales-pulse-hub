
// Mock AI service for demonstrating AI insights functionality
// In production, this would connect to actual AI APIs

export interface AIInsight {
  id: string;
  type: 'trend' | 'alert' | 'insight' | 'recommendation';
  title: string;
  content: string;
  confidence: 'High' | 'Medium' | 'Low';
  timestamp: string;
  metadata?: {
    dataPoints?: string[];
    metrics?: Record<string, number>;
  };
}

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Revenue Growth Acceleration',
    content: 'Your June revenue is 18% above forecast. The main drivers are increased conversion rates from referral sources and shorter sales cycles.',
    confidence: 'High',
    timestamp: '2 hours ago',
    metadata: {
      dataPoints: ['revenue', 'conversion_rate', 'sales_cycle'],
      metrics: { growth_rate: 18, forecast_beat: 0.18 }
    }
  },
  {
    id: '2',
    type: 'alert',
    title: 'Pipeline Bottleneck Detected',
    content: 'Deals are accumulating in the "Proposal" stage. Consider reviewing proposal templates or offering more competitive pricing.',
    confidence: 'Medium',
    timestamp: '5 hours ago',
    metadata: {
      dataPoints: ['pipeline_velocity', 'proposal_stage'],
      metrics: { bottleneck_score: 0.75 }
    }
  },
  {
    id: '3',
    type: 'insight',
    title: 'Optimization Opportunity',
    content: 'Website leads convert 15% better than other sources. Consider increasing marketing spend on SEO and content marketing.',
    confidence: 'High',
    timestamp: '1 day ago',
    metadata: {
      dataPoints: ['lead_sources', 'conversion_rates'],
      metrics: { website_conversion: 0.205, avg_conversion: 0.178 }
    }
  }
];

export const generateAIInsight = async (query: string): Promise<AIInsight> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response based on query keywords
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('conversion') || lowerQuery.includes('drop')) {
    return {
      id: Date.now().toString(),
      type: 'insight',
      title: 'Conversion Analysis',
      content: 'Your conversion rates show seasonal patterns. Summer months typically see a 5-8% dip due to vacation schedules. Consider adjusting your follow-up cadence during this period.',
      confidence: 'High',
      timestamp: 'Just now',
      metadata: {
        dataPoints: ['seasonal_trends', 'conversion_rates'],
        metrics: { seasonal_impact: -0.06 }
      }
    };
  }
  
  if (lowerQuery.includes('month') || lowerQuery.includes('change')) {
    return {
      id: Date.now().toString(),
      type: 'trend',
      title: 'Monthly Performance Update',
      content: 'This month shows strong performance across all metrics. Key highlights: 127 appointments booked (+12.5%), deal value increased to R486K (+18.2%), and sales cycle shortened by 5.3%.',
      confidence: 'High',
      timestamp: 'Just now',
      metadata: {
        dataPoints: ['appointments', 'deal_value', 'sales_cycle'],
        metrics: { appointments_growth: 0.125, value_growth: 0.182 }
      }
    };
  }
  
  if (lowerQuery.includes('rep') || lowerQuery.includes('perform')) {
    return {
      id: Date.now().toString(),
      type: 'insight',
      title: 'Top Performer Analysis',
      content: 'Sarah Johnson leads in conversion rates (32%) while Mike Chen excels in deal volume (23 deals closed). Consider having Sarah mentor the team on closing techniques.',
      confidence: 'High',
      timestamp: 'Just now',
      metadata: {
        dataPoints: ['rep_performance', 'conversion_rates'],
        metrics: { top_conversion: 0.32, top_volume: 23 }
      }
    };
  }
  
  if (lowerQuery.includes('pipeline')) {
    return {
      id: Date.now().toString(),
      type: 'recommendation',
      title: 'Pipeline Optimization',
      content: 'Your pipeline is healthy but could benefit from more top-of-funnel activity. Consider increasing lead generation efforts to maintain momentum.',
      confidence: 'Medium',
      timestamp: 'Just now',
      metadata: {
        dataPoints: ['pipeline_health', 'lead_generation'],
        metrics: { pipeline_velocity: 0.85 }
      }
    };
  }
  
  // Default response
  return {
    id: Date.now().toString(),
    type: 'insight',
    title: 'General Analysis',
    content: 'Based on your current data, you\'re performing well across most metrics. Focus on maintaining consistency in your sales process and continue monitoring key conversion points.',
    confidence: 'Medium',
    timestamp: 'Just now',
    metadata: {
      dataPoints: ['overall_performance'],
      metrics: { health_score: 0.78 }
    }
  };
};

// Simulate WebSocket connection for real-time insights
export class AIInsightsService {
  private listeners: ((insight: AIInsight) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  subscribe(callback: (insight: AIInsight) => void) {
    this.listeners.push(callback);
    
    // Start periodic insights if this is the first subscriber
    if (this.listeners.length === 1) {
      this.startInsightGeneration();
    }
  }

  unsubscribe(callback: (insight: AIInsight) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
    
    // Stop periodic insights if no subscribers
    if (this.listeners.length === 0) {
      this.stopInsightGeneration();
    }
  }

  private startInsightGeneration() {
    // Generate a new insight every 5 minutes (for demo purposes)
    this.intervalId = setInterval(() => {
      const randomInsight = mockAIInsights[Math.floor(Math.random() * mockAIInsights.length)];
      const newInsight = {
        ...randomInsight,
        id: Date.now().toString(),
        timestamp: 'Just now'
      };
      
      this.listeners.forEach(listener => listener(newInsight));
    }, 300000); // 5 minutes
  }

  private stopInsightGeneration() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const aiInsightsService = new AIInsightsService();
