
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Database, AlertTriangle, TrendingUp } from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

const EmptyState = ({ title, description, icon: Icon, actionText, onAction }: {
  title: string;
  description: string;
  icon: React.ElementType;
  actionText: string;
  onAction: () => void;
}) => (
  <Card className="border-dashed border-2 border-muted-foreground/25">
    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
      <Icon className="w-12 h-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
      <Button onClick={onAction} variant="outline">
        {actionText}
      </Button>
    </CardContent>
  </Card>
);

export const DashboardOverview = () => {
  const { integrations, realTimeData } = useAPIIntegrations();

  const hasCalendarData = realTimeData.googleCalendar?.events?.length > 0;
  const hasTrelloData = realTimeData.trello?.boards?.length > 0;
  const hasAnyData = hasCalendarData || hasTrelloData;

  // Calculate real metrics from actual data
  const calendarMetrics = hasCalendarData ? {
    totalEvents: realTimeData.googleCalendar?.events?.length || 0,
    upcomingEvents: realTimeData.googleCalendar?.events?.filter(event => 
      new Date(event.start?.dateTime || event.start?.date) > new Date()
    ).length || 0
  } : null;

  const trelloMetrics = hasTrelloData ? {
    totalBoards: realTimeData.trello?.boards?.length || 0,
    totalCards: realTimeData.trello?.cards?.length || 0
  } : null;

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your APIs to start seeing real-time insights and analytics from your tools.
          </p>
          <Button onClick={() => window.location.hash = '#integrations'}>
            Connect Your First API
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Connected Data Sources
          </CardTitle>
          <CardDescription>Real-time data from your connected APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center gap-2 p-2 border rounded-lg">
                {integration.icon}
                <span className="text-sm font-medium">{integration.name}</span>
                <Badge 
                  variant={integration.status === 'connected' ? 'default' : 
                          integration.status === 'syncing' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {integration.status === 'connected' ? '🟢' : 
                   integration.status === 'syncing' ? '🟠' : '🔴'} 
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real Data Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar Data */}
        {hasCalendarData && calendarMetrics && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calendar Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calendarMetrics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {calendarMetrics.upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>
        )}

        {/* Trello Data */}
        {hasTrelloData && trelloMetrics && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trello Boards</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trelloMetrics.totalBoards}</div>
              <p className="text-xs text-muted-foreground">
                {trelloMetrics.totalCards} total cards
              </p>
            </CardContent>
          </Card>
        )}

        {/* Growth Indicator */}
        {hasAnyData && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">APIs connected</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity from Real Data */}
      {hasAnyData && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your connected APIs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasCalendarData && realTimeData.googleCalendar?.events?.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.summary || 'Unnamed Event'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.start?.dateTime || event.start?.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {hasTrelloData && realTimeData.trello?.boards?.slice(0, 2).map((board, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Trello: {board.name}</p>
                  <p className="text-xs text-muted-foreground">Board updated</p>
                </div>
              </div>
            ))}

            {!hasCalendarData && !hasTrelloData && (
              <p className="text-center text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
