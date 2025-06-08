
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, RefreshCw, CheckCircle, AlertCircle, XCircle, Calendar, Database, Trello, FileText, Zap, MessageSquare } from "lucide-react";
import { APIConnectorDashboard } from "@/components/integrations/APIConnectorDashboard";
import { AddNewAPIModal } from "@/components/integrations/AddNewAPIModal";
import { ForecastPanel } from "@/components/integrations/ForecastPanel";
import { SmartSuggestions } from "@/components/integrations/SmartSuggestions";
import { AskAIPanel } from "@/components/integrations/AskAIPanel";
import { useState } from "react";

export const IntegrationsTab = () => {
  const [showAddAPIModal, setShowAddAPIModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">API Integration Center</h2>
          <p className="text-muted-foreground">Manage your connected services and data sources</p>
        </div>
        <Button onClick={() => setShowAddAPIModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Connect New API
        </Button>
      </div>

      {/* API Connector Dashboard */}
      <APIConnectorDashboard />

      {/* AI-Powered Insights Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Forecast Panel */}
        <div className="lg:col-span-2">
          <ForecastPanel />
        </div>
        
        {/* Smart Suggestions */}
        <div>
          <SmartSuggestions />
        </div>
      </div>

      {/* Ask AI Panel */}
      <AskAIPanel />

      {/* Add New API Modal */}
      <AddNewAPIModal 
        open={showAddAPIModal} 
        onOpenChange={setShowAddAPIModal} 
      />
    </div>
  );
};
