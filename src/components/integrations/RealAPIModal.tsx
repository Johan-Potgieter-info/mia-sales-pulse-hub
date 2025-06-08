
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { Calendar, Database, Trello, MessageSquare, ExternalLink } from "lucide-react";

interface RealAPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RealAPIModal = ({ open, onOpenChange }: RealAPIModalProps) => {
  const [trelloKey, setTrelloKey] = useState("");
  const [trelloToken, setTrelloToken] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiProvider, setAiProvider] = useState<'openai' | 'claude'>('openai');
  const [aiModel, setAiModel] = useState("gpt-4");
  
  const { connectTrelloAPI, connectGoogleCalendar, connectAIAPI, isLoading } = useAPIIntegrations();

  const handleTrelloConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trelloKey && trelloToken) {
      await connectTrelloAPI(trelloKey, trelloToken);
      setTrelloKey("");
      setTrelloToken("");
      onOpenChange(false);
    }
  };

  const handleGoogleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (googleToken) {
      await connectGoogleCalendar(googleToken);
      setGoogleToken("");
      onOpenChange(false);
    }
  };

  const handleAIConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiApiKey) {
      await connectAIAPI(aiApiKey, aiProvider, aiModel);
      setAiApiKey("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect Real APIs</DialogTitle>
          <DialogDescription>
            Connect your actual API accounts to see real data in the dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="trello" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trello" className="flex items-center gap-2">
              <Trello className="w-4 h-4" />
              Trello
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Google
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI APIs
            </TabsTrigger>
          </TabsList>

          {/* Trello Connection */}
          <TabsContent value="trello" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">How to get Trello API credentials:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://trello.com/app-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Trello API Key <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Copy your API Key</li>
                  <li>Click "Token" to generate a token</li>
                  <li>Authorize the application and copy the token</li>
                </ol>
              </div>
              
              <form onSubmit={handleTrelloConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trello-key">Trello API Key</Label>
                  <Input
                    id="trello-key"
                    type="password"
                    placeholder="Enter your Trello API key..."
                    value={trelloKey}
                    onChange={(e) => setTrelloKey(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trello-token">Trello Token</Label>
                  <Input
                    id="trello-token"
                    type="password"
                    placeholder="Enter your Trello token..."
                    value={trelloToken}
                    onChange={(e) => setTrelloToken(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading || !trelloKey || !trelloToken} className="w-full">
                  {isLoading ? "Connecting..." : "Connect Trello"}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Google Calendar Connection */}
          <TabsContent value="google" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">How to get Google Calendar access:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Enable the Calendar API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Use OAuth Playground to get an access token</li>
                </ol>
              </div>
              
              <form onSubmit={handleGoogleConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-token">Google Calendar Access Token</Label>
                  <Input
                    id="google-token"
                    type="password"
                    placeholder="Enter your access token..."
                    value={googleToken}
                    onChange={(e) => setGoogleToken(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading || !googleToken} className="w-full">
                  {isLoading ? "Connecting..." : "Connect Google Calendar"}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* AI APIs Connection */}
          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">AI API Integration:</h4>
                <p className="text-sm text-muted-foreground">
                  Connect OpenAI or Claude to get AI-powered insights from your data.
                </p>
              </div>
              
              <form onSubmit={handleAIConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-provider">AI Provider</Label>
                  <Select value={aiProvider} onValueChange={(value: 'openai' | 'claude') => setAiProvider(value)}>
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
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
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
                </div>

                <Button type="submit" disabled={isLoading || !aiApiKey} className="w-full">
                  {isLoading ? "Connecting..." : `Connect ${aiProvider === 'openai' ? 'OpenAI' : 'Claude'}`}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
