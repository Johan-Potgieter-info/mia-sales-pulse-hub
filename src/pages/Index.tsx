
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
    <>
      <div className="container relative hidden h-full flex-col overflow-hidden md:flex">
        <div className="flex flex-1 items-start space-y-2 p-8 pt-6 md:block">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-2 sm:w-[350px]">
            <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="aip">AIP Platform</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="trello">Trello</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="calendly">Calendly</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="aip">
              <AIPDashboard />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>

            <TabsContent value="trello">
              <TrelloTab />
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarTab />
            </TabsContent>

            <TabsContent value="calendly">
              <CalendlyTab />
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
