import { TrelloBoardManager } from "@/components/trello/TrelloBoardManager";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const TrelloTab = () => {
  const { integrations } = useAPIIntegrations();
  
  // Find Trello integration
  const trelloIntegration = integrations.find(int => int.provider === 'trello');
  
  if (!trelloIntegration) {
    return (
      <div className="space-y-6 p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No Trello integration found. Please connect to Trello first in the Integrations tab.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TrelloBoardManager 
      apiKey={trelloIntegration.apiKey}
      token={trelloIntegration.accessToken}
      // You can add a board ID selector here or use a default one
      boardId="your_board_id_here"
    />
  );
};
