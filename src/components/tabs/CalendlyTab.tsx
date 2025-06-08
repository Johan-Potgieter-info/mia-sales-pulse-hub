
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const mockCalendlyData = {
  summary: {
    totalBookings: 127,
    confirmedMeetings: 98,
    noShows: 12,
    conversionRate: 77.2
  },
  recentAppointments: [
    {
      id: 1,
      clientName: "Sarah Johnson",
      meetingType: "Sales Discovery Call",
      scheduledTime: "2024-06-08 14:00",
      status: "confirmed",
      duration: 30
    },
    {
      id: 2,
      clientName: "Tech Solutions Ltd",
      meetingType: "Product Demo",
      scheduledTime: "2024-06-08 16:30",
      status: "pending",
      duration: 60
    },
    {
      id: 3,
      clientName: "Mike Chen",
      meetingType: "Follow-up Meeting",
      scheduledTime: "2024-06-09 10:00",
      status: "confirmed",
      duration: 30
    },
    {
      id: 4,
      clientName: "Global Industries",
      meetingType: "Contract Discussion",
      scheduledTime: "2024-06-09 15:00",
      status: "no-show",
      duration: 45
    }
  ],
  weeklyStats: [
    { day: "Mon", bookings: 8 },
    { day: "Tue", bookings: 12 },
    { day: "Wed", bookings: 15 },
    { day: "Thu", bookings: 10 },
    { day: "Fri", bookings: 18 },
    { day: "Sat", bookings: 3 },
    { day: "Sun", bookings: 1 }
  ]
};

export const CalendlyTab = () => {
  const { summary, recentAppointments } = mockCalendlyData;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'no-show':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      pending: "secondary", 
      "no-show": "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalBookings}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.confirmedMeetings}</div>
            <p className="text-xs text-muted-foreground">Meetings attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Shows</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.noShows}</div>
            <p className="text-xs text-muted-foreground">Missed appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Show Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.conversionRate}%</div>
            <Progress value={summary.conversionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest scheduled meetings and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <h4 className="font-medium">{appointment.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.meetingType}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm">{new Date(appointment.scheduledTime).toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{appointment.duration}min</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Types Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Types</CardTitle>
            <CardDescription>Performance by meeting type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sales Discovery Calls</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-20" />
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Product Demos</span>
              <div className="flex items-center gap-2">
                <Progress value={72} className="w-20" />
                <span className="text-sm text-muted-foreground">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Follow-up Meetings</span>
              <div className="flex items-center gap-2">
                <Progress value={91} className="w-20" />
                <span className="text-sm text-muted-foreground">91%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Slots Performance</CardTitle>
            <CardDescription>Best performing time slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Morning (9-12 PM)</span>
              <Badge>High conversion</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Afternoon (1-5 PM)</span>
              <Badge variant="secondary">Medium conversion</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Evening (6-8 PM)</span>
              <Badge variant="outline">Low conversion</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
