
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CalendlyTab = () => {
  const { realTimeData, integrations } = useAPIIntegrations();
  
  const calendlyIntegration = integrations.find(int => int.provider === 'calendly' && int.status === 'connected');
  const calendlyData = realTimeData.calendly;

  if (!calendlyIntegration) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Calendly Connection</h3>
            <p className="text-muted-foreground">Connect your Calendly account to view scheduling data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!calendlyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto animate-spin" />
          <div>
            <h3 className="text-lg font-semibold">Loading Calendly Data</h3>
            <p className="text-muted-foreground">Fetching your scheduling information...</p>
          </div>
        </div>
      </div>
    );
  }

  const { eventTypes = [], user } = calendlyData;
  const totalEventTypes = eventTypes.length;

  return (
    <div className="space-y-6">
      {/* User Information Card */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Calendly Account: {user.name}
            </CardTitle>
            <CardDescription>
              Connected to {user.email} • Last synced: {calendlyIntegration.lastSync}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Timezone: {user.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <a 
                  href={user.scheduling_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Visit Scheduling Page
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Locale: {user.locale}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventTypes}</div>
            <p className="text-xs text-muted-foreground">Available booking types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Calendly connection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Format</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.time_notation || '12h'}</div>
            <p className="text-xs text-muted-foreground">Display format</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connected</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Event Types */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
          <CardDescription>Your available Calendly meeting types</CardDescription>
        </CardHeader>
        <CardContent>
          {eventTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventTypes.map((eventType: any) => (
                  <TableRow key={eventType.uri}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{eventType.name}</div>
                        {eventType.description_plain && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {eventType.description_plain}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {eventType.duration} min
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={eventType.kind === 'solo' ? 'default' : 'secondary'}>
                        {eventType.kind}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={eventType.active ? 'default' : 'secondary'}>
                        {eventType.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(eventType.scheduling_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Event Types Found</h3>
              <p className="text-muted-foreground">
                Create event types in your Calendly account to see them here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
            <CardDescription>Event type performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventTypes.length > 0 ? (
              eventTypes.map((eventType: any, index: number) => (
                <div key={eventType.uri} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{eventType.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={eventType.active ? 'default' : 'secondary'}>
                      {eventType.duration}min
                    </Badge>
                    <Badge variant="outline">
                      {eventType.kind}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No event types to analyze</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
            <CardDescription>Connection status and data sync</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Connection</span>
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Sync</span>
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Event Types Loaded</span>
              <Badge variant="outline">{totalEventTypes}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="text-xs text-muted-foreground">
                {calendlyIntegration.lastSync ? new Date(calendlyIntegration.lastSync).toLocaleString() : 'Never'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
