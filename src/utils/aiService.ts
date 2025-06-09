
import { supabase } from '@/integrations/supabase/client';
import { credentialsService } from '@/services/credentialsService';

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

    // Get AI integrations for the user
    const { data: integrations, error } = await supabase
      .from('api_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', 'ai')
      .eq('status', 'connected');

    if (error) {
      console.error('Error fetching AI integrations:', error);
      throw new Error('Failed to get AI integrations');
    }

    if (!integrations || integrations.length === 0) {
      throw new Error('No AI API connected. Please connect an AI API first.');
    }

    // Use the first available AI integration
    const aiIntegration = integrations[0];
    
    // Get the API key for this integration
    const credentials = await credentialsService.getIntegrationCredentials(aiIntegration.id);
    
    if (!credentials.api_key) {
      throw new Error('No API key found for AI integration');
    }

    let response: Response;
    let result: any;

    if (aiIntegration.provider === 'openai') {
      console.log('Using OpenAI for query:', query);
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: credentials.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a business intelligence assistant. Provide concise, actionable insights based on the user\'s query. Focus on practical recommendations and key metrics.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
      }

      result = await response.json();
      const content = result.choices[0]?.message?.content || 'No response generated';

      return {
        title: 'AI Insight',
        content,
        confidence: 'High',
        metadata: {
          metrics: {
            'Model': credentials.model || 'gpt-4o-mini',
            'Provider': 'OpenAI',
            'Tokens': result.usage?.total_tokens || 0
          }
        }
      };

    } else if (aiIntegration.provider === 'claude') {
      console.log('Using Claude for query:', query);
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': credentials.api_key,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: credentials.model || 'claude-3-haiku-20240307',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `You are a business intelligence assistant. Provide concise, actionable insights based on this query: ${query}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Claude API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
      }

      result = await response.json();
      const content = result.content[0]?.text || 'No response generated';

      return {
        title: 'AI Insight',
        content,
        confidence: 'High',
        metadata: {
          metrics: {
            'Model': credentials.model || 'claude-3-haiku-20240307',
            'Provider': 'Anthropic',
            'Usage': result.usage?.output_tokens || 0
          }
        }
      };
    }

    throw new Error(`Unsupported AI provider: ${aiIntegration.provider}`);

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
