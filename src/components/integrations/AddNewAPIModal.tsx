
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { Calendar, Database, FileText, MessageSquare, Zap, BarChart3, Users, DollarSign } from "lucide-react";

interface AddNewAPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularAPIs = [
  { name: "HubSpot", category: "crm", icon: <Users className="w-4 h-4" /> },
  { name: "Salesforce", category: "crm", icon: <DollarSign className="w-4 h-4" /> },
  { name: "Pipedrive", category: "crm", icon: <BarChart3 className="w-4 h-4" /> },
  { name: "Notion", category: "knowledge", icon: <FileText className="w-4 h-4" /> },
  { name: "Slack", category: "communication", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Zapier", category: "automation", icon: <Zap className="w-4 h-4" /> },
  { name: "Google Sheets", category: "storage", icon: <Database className="w-4 h-4" /> },
  { name: "Microsoft Teams", category: "communication", icon: <MessageSquare className="w-4 h-4" /> },
];

export const AddNewAPIModal = ({ open, onOpenChange }: AddNewAPIModalProps) => {
  const [selectedAPI, setSelectedAPI] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [description, setDescription] = useState("");
  const { addIntegration } = useAPIIntegrations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedAPIData = popularAPIs.find(api => api.name === selectedAPI);
    
    if (selectedAPIData) {
      addIntegration({
        name: customName || selectedAPIData.name,
        status: 'connected',
        lastSync: 'Just now',
        description: description || `${selectedAPIData.name} integration`,
        icon: selectedAPIData.icon,
        category: selectedAPIData.category,
        metrics: {
          'Status': 'New',
          'Records': 0
        }
      });
      
      // Reset form
      setSelectedAPI("");
      setApiKey("");
      setEndpointUrl("");
      setCustomName("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect New API</DialogTitle>
          <DialogDescription>
            Add a new integration to your dashboard. Popular services are pre-configured for easy setup.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-select">Select API Service</Label>
            <Select value={selectedAPI} onValueChange={setSelectedAPI}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {popularAPIs.map((api) => (
                  <SelectItem key={api.name} value={api.name}>
                    <div className="flex items-center gap-2">
                      {api.icon}
                      <span>{api.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {api.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint URL</Label>
              <Input
                id="endpoint"
                placeholder="https://api.example.com"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-name">Custom Name (Optional)</Label>
            <Input
              id="custom-name"
              placeholder="e.g., Sales HubSpot, Marketing Slack..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this integration..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAPI || !apiKey}>
              Connect API
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
