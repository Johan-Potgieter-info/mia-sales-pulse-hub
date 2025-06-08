
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { IntegrationsTab } from "@/components/tabs/IntegrationsTab";
import { TrelloTab } from "@/components/tabs/TrelloTab";
import { CalendlyTab } from "@/components/tabs/CalendlyTab";
import { GoogleDriveTab } from "@/components/tabs/GoogleDriveTab";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Sales Pulse Hub</h1>
              <p className="text-xl text-muted-foreground">
                Your unified dashboard for sales analytics and integrations
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="trello">Trello</TabsTrigger>
                <TabsTrigger value="calendly">Calendly</TabsTrigger>
                <TabsTrigger value="drive">Google Drive</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-4">
                <IntegrationsTab />
              </TabsContent>

              <TabsContent value="trello" className="space-y-4">
                <TrelloTab />
              </TabsContent>

              <TabsContent value="calendly" className="space-y-4">
                <CalendlyTab />
              </TabsContent>

              <TabsContent value="drive" className="space-y-4">
                <GoogleDriveTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
