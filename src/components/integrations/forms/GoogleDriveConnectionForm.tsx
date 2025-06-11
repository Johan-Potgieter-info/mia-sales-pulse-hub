
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderOpen, ExternalLink, AlertCircle } from "lucide-react";

interface GoogleDriveConnectionFormProps {
  onConnect: (accessToken: string) => Promise<void>;
  isLoading: boolean;
}

export const GoogleDriveConnectionForm = ({ onConnect, isLoading }: GoogleDriveConnectionFormProps) => {
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken.trim()) return;
    await onConnect(accessToken.trim());
    setAccessToken("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-500" />
          Connect Google Drive
        </CardTitle>
        <CardDescription>
          Access your Google Sheets, Forms, and Documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You'll need to obtain an access token from Google Cloud Console with Drive API permissions.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drive-token">Access Token</Label>
            <p className="text-sm text-muted-foreground">
              Required scopes: https://www.googleapis.com/auth/drive.readonly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="drive-token"
              type="password"
              placeholder="Enter your Google Drive access token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              required
            />
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !accessToken.trim()}>
                {isLoading ? "Connecting..." : "Connect Google Drive"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Token
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Setup Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Go to Google Cloud Console</li>
            <li>Enable the Google Drive API</li>
            <li>Create credentials (OAuth 2.0)</li>
            <li>Generate an access token with Drive API scope</li>
            <li>Copy and paste the token above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
