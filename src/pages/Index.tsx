
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { CalendarTab } from "@/components/tabs/CalendarTab"
import { TrelloTab } from "@/components/tabs/TrelloTab"
import { IntegrationsTab } from "@/components/tabs/IntegrationsTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsTab } from "@/components/tabs/AnalyticsTab";
import { CalendlyTab } from "@/components/tabs/CalendlyTab";
import { AIPDashboard } from "@/components/aip/AIPDashboard";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-1 h-auto p-1">
            <TabsTrigger value="dashboard" className="text-xs md:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="aip" className="text-xs md:text-sm">AIP</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs md:text-sm">Integrations</TabsTrigger>
            <TabsTrigger value="trello" className="text-xs md:text-sm">Trello</TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs md:text-sm">Calendar</TabsTrigger>
            <TabsTrigger value="calendly" className="text-xs md:text-sm">Calendly</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="aip" className="mt-6">
            <AIPDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="trello" className="mt-6">
            <TrelloTab />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarTab />
          </TabsContent>

          <TabsContent value="calendly" className="mt-6">
            <CalendlyTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
