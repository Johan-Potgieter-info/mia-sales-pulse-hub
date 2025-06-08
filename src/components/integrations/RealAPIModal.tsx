
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { Calendar, Trello, MessageSquare } from "lucide-react";
import { AIConnectionForm } from "./forms/AIConnectionForm";
import { TrelloConnectionForm } from "./forms/TrelloConnectionForm";
import { GoogleCalendarConnectionForm } from "./forms/GoogleCalendarConnectionForm";

interface RealAPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RealAPIModal = ({ open, onOpenChange }: RealAPIModalProps) => {
  const { connectTrelloAPI, connectGoogleCalendar, connectAIAPI, isLoading } = useAPIIntegrations();

  const handleTrelloConnect = async (apiKey: string, token: string) => {
    await connectTrelloAPI(apiKey, token);
    onOpenChange(false);
  };

  const handleGoogleConnect = async (accessToken: string) => {
    await connectGoogleCalendar(accessToken);
    onOpenChange(false);
  };

  const handleAIConnect = async (apiKey: string, provider: 'openai' | 'claude', model: string) => {
    await connectAIAPI(apiKey, provider, model);
    onOpenChange(false);
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
        
        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI APIs
            </TabsTrigger>
            <TabsTrigger value="trello" className="flex items-center gap-2">
              <Trello className="w-4 h-4" />
              Trello
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Google
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <AIConnectionForm onConnect={handleAIConnect} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="trello" className="space-y-4">
            <TrelloConnectionForm onConnect={handleTrelloConnect} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <GoogleCalendarConnectionForm onConnect={handleGoogleConnect} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
