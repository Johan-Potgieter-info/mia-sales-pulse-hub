
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, ExternalLink, Shield, Webhook, Zap } from "lucide-react";
import { CalendlyOAuthButton } from "@/components/calendly/CalendlyOAuthButton";

interface CalendlyV2ConnectionFormProps {
  onConnect?: () => void;
}

export const CalendlyV2ConnectionForm = ({ onConnect }: CalendlyV2ConnectionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Connect Calendly (OAuth 2.0)
        </CardTitle>
        <CardDescription>
          Connect your Calendly account using secure OAuth 2.0 authentication with enhanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Enhanced Calendly Integration Features:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>OAuth 2.0 with PKCE for secure authentication</li>
              <li>Real-time availability checking</li>
              <li>Embedded booking widget</li>
              <li>Webhook notifications for bookings/cancellations</li>
              <li>Multi-calendar conflict handling</li>
              <li>Rate-limit safe API calls with caching</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
            <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Real-time Data</div>
              <div className="text-muted-foreground">Live availability and booking updates</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted">
            <Webhook className="w-4 h-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Webhook Events</div>
              <div className="text-muted-foreground">Automatic sync of bookings and cancellations</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <CalendlyOAuthButton onSuccess={onConnect} />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            <span>You'll be redirected to Calendly to authorize access</span>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            This integration uses Calendly API v2 and includes webhook support for real-time updates.
            Your access tokens are encrypted and stored securely.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
