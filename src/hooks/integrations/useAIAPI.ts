
import { useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration, AIProvider } from '@/types/apiIntegrations';

export const useAIAPI = () => {
  const { toast } = useToast();

  const connectAIAPI = useCallback(async (apiKey: string, provider: AIProvider, model: string) => {
    try {
      console.log(`Connecting to ${provider} API with model ${model}...`);
      
      let response: Response;
      let testSuccessful = false;
      let errorDetails = '';

      if (provider === 'openai') {
        try {
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: 'Test connection' }],
              max_tokens: 5
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('OpenAI API error:', response.status, errorData);
            
            if (response.status === 401) {
              errorDetails = 'Invalid API key. Please check your OpenAI API key.';
            } else if (response.status === 429) {
              errorDetails = 'Rate limit exceeded. Please try again later.';
            } else if (response.status === 400 && errorData?.error?.code === 'model_not_found') {
              errorDetails = `Model "${model}" not found. Please check the model name.`;
            } else {
              errorDetails = errorData?.error?.message || `HTTP ${response.status}: Failed to connect to OpenAI`;
            }
            throw new Error(errorDetails);
          }

          const result = await response.json();
          console.log('OpenAI API test successful:', result);
          testSuccessful = true;
        } catch (fetchError) {
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            errorDetails = 'Network error: Cannot reach OpenAI API. Check your internet connection.';
          } else {
            errorDetails = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
          }
          throw fetchError;
        }
      } else if (provider === 'claude') {
        try {
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model,
              max_tokens: 5,
              messages: [{ role: 'user', content: 'Test connection' }]
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Claude API error:', response.status, errorData);
            
            if (response.status === 401) {
              errorDetails = 'Invalid API key. Please check your Anthropic API key.';
            } else if (response.status === 429) {
              errorDetails = 'Rate limit exceeded. Please try again later.';
            } else if (response.status === 400 && errorData?.error?.type === 'invalid_request_error') {
              errorDetails = `Model "${model}" not found or invalid. Please check the model name.`;
            } else {
              errorDetails = errorData?.error?.message || `HTTP ${response.status}: Failed to connect to Claude`;
            }
            throw new Error(errorDetails);
          }

          const result = await response.json();
          console.log('Claude API test successful:', result);
          testSuccessful = true;
        } catch (fetchError) {
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            errorDetails = 'Network error: Cannot reach Anthropic API. Check your internet connection.';
          } else {
            errorDetails = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
          }
          throw fetchError;
        }
      }

      if (testSuccessful) {
        const integration: APIIntegration = {
          id: `ai-${provider}`,
          name: `${provider === 'openai' ? 'OpenAI' : 'Claude'} AI`,
          status: 'connected',
          lastSync: new Date().toLocaleString(),
          description: `AI insights powered by ${model}`,
          icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
          category: 'ai',
          apiKey,
          hasData: true,
          metrics: {
            'Model': model,
            'Provider': provider === 'openai' ? 'OpenAI' : 'Anthropic',
            'Status': 'Connected'
          }
        };

        toast({
          title: "AI API Connected",
          description: `Successfully connected to ${provider === 'openai' ? 'OpenAI' : 'Claude'} using ${model}`,
        });

        return { integration, data: null };
      }

    } catch (error) {
      console.error('AI API connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: `ai-${provider}`,
        name: `${provider === 'openai' ? 'OpenAI' : 'Claude'} AI`,
        status: 'error',
        lastSync: null,
        description: `AI insights powered by ${model}`,
        icon: <MessageSquare className="w-4 h-4 text-red-500" />,
        category: 'ai',
        hasData: false,
        errorMessage
      };

      toast({
        title: "AI API Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectAIAPI };
};
