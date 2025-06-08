
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Users, TrendingUp } from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { AskAIPanel } from "@/components/integrations/AskAIPanel";

export const GoogleCalendarDashboard = () => {
  const { integrations, realTimeData } = useAPIIntegrations();
  
  const googleCalendarIntegration = integrations.find(int => int.provider === 'google-calendar' && int.status === 'connected');
  const calendarData = realTimeData.googleCalendar;
  
  if (!googleCalendarIntegration) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Google Calendar not connected</p>
      </div>
    );
  }

  // Calculate analytics from calendar data
  const events = calendarData?.events || [];
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  
  const thisWeekEvents = events.filter(event => {
    if (!event.start?.dateTime) return false;
    const eventDate = new Date(event.start.dateTime);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });

  const totalHoursThisWeek = thisWeekEvents.reduce((total, event) => {
    if (!event.start?.dateTime || !event.end?.dateTime) return total;
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  const workDays = 5; // Assuming Mon-Fri
  const workHoursPerDay = 8;
  const totalWorkHours = workDays * workHoursPerDay;
  const freeHours = totalWorkHours - totalHoursThisWeek;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Google Calendar Analytics</h2>
          <p className="text-muted-foreground">
            Calendar insights and time management analytics
          </p>
        </div>
        <Badge variant="default" className="bg-green-600">
          <CalendarDays className="w-4 h-4 mr-1" />
          Connected
        </Badge>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              All time events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Bookings this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursThisWeek.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{freeHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Available this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Mirror */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Your upcoming calendar events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 10).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{event.summary || 'No Title'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : 'No date'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {event.status || 'confirmed'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Assistant for Calendar Context */}
      <AskAIPanel context="google-calendar" />
    </div>
  );
};
