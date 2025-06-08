
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface TrelloConnectionFormProps {
  onConnect: (apiKey: string, token: string) => Promise<void>;
  isLoading: boolean;
}

export const TrelloConnectionForm = ({ onConnect, isLoading }: TrelloConnectionFormProps) => {
  const [trelloKey, setTrelloKey] = useState("");
  const [trelloToken, setTrelloToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trelloKey && trelloToken) {
      await onConnect(trelloKey, trelloToken);
      setTrelloKey("");
      setTrelloToken("");
    }
  };

  return (
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
