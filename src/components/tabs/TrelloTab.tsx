
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trello, Clock, CheckCircle, ArrowRight, Users, Calendar } from "lucide-react";

const mockTrelloData = {
  summary: {
    totalCards: 156,
    completedCards: 89,
    inProgressCards: 45,
    averageCompletionTime: 4.2
  },
  boards: [
    {
      id: 1,
      name: "Sales Pipeline Q2",
      cards: 45,
      completed: 28,
      inProgress: 12,
      todo: 5,
      completionRate: 62
    },
    {
      id: 2,
      name: "Client Onboarding",
      cards: 32,
      completed: 25,
      inProgress: 5,
      todo: 2,
      completionRate: 78
    },
    {
      id: 3,
      name: "Product Development",
      cards: 28,
      completed: 15,
      inProgress: 8,
      todo: 5,
      completionRate: 54
    },
    {
      id: 4,
      name: "Marketing Campaigns",
      cards: 24,
      completed: 18,
      inProgress: 4,
      todo: 2,
      completionRate: 75
    }
  ],
  recentActivity: [
    {
      id: 1,
      action: "moved",
      cardName: "Follow up with Acme Corp",
      fromList: "In Progress",
      toList: "Done",
      user: "Sarah Johnson",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      action: "created",
      cardName: "Schedule demo for Tech Solutions",
      fromList: null,
      toList: "To Do",
      user: "Mike Chen",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      action: "moved",
      cardName: "Contract review - Global Industries",
      fromList: "To Do",
      toList: "In Progress",
      user: "Lisa Wong",
      timestamp: "1 day ago"
    },
    {
      id: 4,
      action: "completed",
      cardName: "Proposal sent to StartupCo",
      fromList: "In Progress",
      toList: "Done",
      user: "David Miller",
      timestamp: "2 days ago"
    }
  ],
  teamVelocity: [
    { week: "Week 1", completed: 12 },
    { week: "Week 2", completed: 18 },
    { week: "Week 3", completed: 15 },
    { week: "Week 4", completed: 22 }
  ]
};

export const TrelloTab = () => {
  const { summary, boards, recentActivity } = mockTrelloData;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'moved':
        return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'created':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionText = (activity: any) => {
    switch (activity.action) {
      case 'moved':
        return `moved "${activity.cardName}" from ${activity.fromList} to ${activity.toList}`;
      case 'created':
        return `created "${activity.cardName}" in ${activity.toList}`;
      case 'completed':
        return `completed "${activity.cardName}"`;
      default:
        return `updated "${activity.cardName}"`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Trello className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCards}</div>
            <p className="text-xs text-muted-foreground">Across all boards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completedCards}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.inProgressCards}</div>
            <p className="text-xs text-muted-foreground">Active cards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.averageCompletionTime} days</div>
            <p className="text-xs text-muted-foreground">Per card</p>
          </CardContent>
        </Card>
      </div>

      {/* Board Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Board Performance</CardTitle>
          <CardDescription>Completion rates and activity across boards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {boards.map((board) => (
              <div key={board.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{board.name}</h4>
                  <Badge variant="outline">{board.completionRate}% complete</Badge>
                </div>
                <Progress value={board.completionRate} className="h-2" />
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-green-600">{board.completed}</div>
                    <div className="text-muted-foreground">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{board.inProgress}</div>
                    <div className="text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{board.todo}</div>
                    <div className="text-muted-foreground">To Do</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{board.cards}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest card movements and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getActionIcon(activity.action)}
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {getActionText(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
