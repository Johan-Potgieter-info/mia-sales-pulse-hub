
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface AIConnectionFormProps {
  onConnect: (apiKey: string, provider: 'openai' | 'claude', model: string) => Promise<void>;
  isLoading: boolean;
}

export const AIConnectionForm = ({ onConnect, isLoading }: AIConnectionFormProps) => {
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiProvider, setAiProvider] = useState<'openai' | 'claude'>('openai');
  const [aiModel, setAiModel] = useState("gpt-4o");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiApiKey) {
      await onConnect(aiApiKey, aiProvider, aiModel);
      setAiApiKey("");
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Connect OpenAI or Claude to get AI-powered insights from your connected data.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-provider">AI Provider</Label>
          <Select value={aiProvider} onValueChange={(value: 'openai' | 'claude') => {
            setAiProvider(value);
            setAiModel(value === 'openai' ? 'gpt-4o' : 'claude-3-opus-20240229');
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="claude">Anthropic Claude</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-model">Model</Label>
          <Select value={aiModel} onValueChange={setAiModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiProvider === 'openai' ? (
                <>
                  <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ai-key">API Key</Label>
          <Input
            id="ai-key"
            type="password"
            placeholder={`Enter your ${aiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API key...`}
            value={aiApiKey}
            onChange={(e) => setAiApiKey(e.target.value)}
            required
          />
          <div className="text-xs text-muted-foreground">
            {aiProvider === 'openai' ? (
              <>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></>
            ) : (
              <>Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Anthropic Console</a></>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading || !aiApiKey} className="w-full">
          {isLoading ? "Testing Connection..." : `Connect ${aiProvider === 'openai' ? 'OpenAI' : 'Claude'}`}
        </Button>
      </form>
    </div>
  );
};
