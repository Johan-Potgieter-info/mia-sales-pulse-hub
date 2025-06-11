
import { supabase } from '@/integrations/supabase/client';

interface AIInsight {
  title: string;
  content: string;
  confidence: string;
  metadata: {
    metrics: Record<string, string | number>;
  };
}

export const generateAIInsight = async (query: string): Promise<AIInsight> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

  // Invoke the AI chat function on the backend
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { query }
  });

  if (error) {
    console.error('AI function error:', error);
    throw new Error(error.message || 'Failed to generate AI insight');
  }

  const content = (data as any)?.content || 'No response generated';

  return {
    title: 'AI Insight',
    content,
    confidence: 'High',
    metadata: {
      metrics: {
        Provider: 'OpenAI'
      }
    }
  };

  } catch (error) {
    console.error('AI service error:', error);
    
    // Return a proper error response instead of fallback text
    return {
      title: 'AI Service Error',
      content: error instanceof Error ? error.message : 'Failed to generate AI insight. Please check your AI API connection.',
      confidence: 'Low',
      metadata: {
        metrics: {
          'Status': 'Error',
          'Provider': 'None'
        }
      }
    };
  }
};
