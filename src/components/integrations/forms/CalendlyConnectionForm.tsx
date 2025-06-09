
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CalendlyConnectionFormProps {
  onConnect: (accessToken: string) => Promise<void>;
  isLoading: boolean;
}

export const CalendlyConnectionForm = ({ onConnect, isLoading }: CalendlyConnectionFormProps) => {
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken.trim()) return;
    
    await onConnect(accessToken.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Connect Calendly
        </CardTitle>
        <CardDescription>
          Connect your Calendly account to track scheduling metrics and appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To get your Calendly Personal Access Token:
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Go to Calendly Integrations & Apps</li>
              <li>Click on "API & Webhooks"</li>
              <li>Generate a Personal Access Token</li>
              <li>Copy and paste it below</li>
            </ol>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calendly-token">Personal Access Token</Label>
            <Input
              id="calendly-token"
              type="password"
              placeholder="Your Calendly Personal Access Token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading || !accessToken.trim()}
              className="flex-1"
            >
              {isLoading ? "Connecting..." : "Connect Calendly"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => window.open('https://calendly.com/integrations/api_webhooks', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
