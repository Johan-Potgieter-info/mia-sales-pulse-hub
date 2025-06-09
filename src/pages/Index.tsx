
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { IntegrationsTab } from "@/components/tabs/IntegrationsTab";
import { TrelloTab } from "@/components/tabs/TrelloTab";
import { CalendlyTab } from "@/components/tabs/CalendlyTab";
import { GoogleDriveTab } from "@/components/tabs/GoogleDriveTab";
import { GoogleCalendarDashboard } from "@/components/tabs/GoogleCalendarDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

const Index = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { integrations } = useAPIIntegrations();

  // Filter only connected integrations
  const connectedIntegrations = integrations.filter(int => int.status === 'connected');
  const hasTrello = connectedIntegrations.some(int => int.provider === 'trello');
  const hasGoogleCalendar = connectedIntegrations.some(int => int.provider === 'google-calendar');
  const hasCalendly = connectedIntegrations.some(int => int.provider === 'calendly');
  const hasGoogleDrive = connectedIntegrations.some(int => int.provider === 'google-drive');

  const allTabs = [
    { value: "analytics", label: "Analytics" },
    { value: "integrations", label: "Integrations" },
    ...(hasTrello ? [{ value: "trello", label: "Trello" }] : []),
    ...(hasGoogleCalendar ? [{ value: "google-calendar", label: "Google Calendar" }] : []),
    ...(hasCalendly ? [{ value: "calendly", label: "Calendly" }] : []),
    ...(hasGoogleDrive ? [{ value: "drive", label: "Google Drive" }] : []),
  ];

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
              <div className="relative w-full">
                <Carousel className="w-full max-w-full">
                  <CarouselContent className="-ml-1">
                    <CarouselItem className="pl-1 basis-auto">
                      <TabsList className="h-10 p-1 bg-muted rounded-md">
                        {allTabs.map((tab) => (
                          <TabsTrigger 
                            key={tab.value}
                            value={tab.value}
                            className="whitespace-nowrap px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground shrink-0"
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsTab />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-4">
                <IntegrationsTab />
              </TabsContent>

              {hasTrello && (
                <TabsContent value="trello" className="space-y-4">
                  <TrelloTab />
                </TabsContent>
              )}

              {hasGoogleCalendar && (
                <TabsContent value="google-calendar" className="space-y-4">
                  <GoogleCalendarDashboard />
                </TabsContent>
              )}

              {hasCalendly && (
                <TabsContent value="calendly" className="space-y-4">
                  <CalendlyTab />
                </TabsContent>
              )}

              {hasGoogleDrive && (
                <TabsContent value="drive" className="space-y-4">
                  <GoogleDriveTab />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
