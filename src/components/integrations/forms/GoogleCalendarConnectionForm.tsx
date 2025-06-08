
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface GoogleCalendarConnectionFormProps {
  onConnect: (accessToken: string) => Promise<void>;
  isLoading: boolean;
}

export const GoogleCalendarConnectionForm = ({ onConnect, isLoading }: GoogleCalendarConnectionFormProps) => {
  const [googleToken, setGoogleToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (googleToken) {
      await onConnect(googleToken);
      setGoogleToken("");
    }
  };

  return (
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
