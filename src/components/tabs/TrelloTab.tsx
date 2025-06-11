
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Users, Plus, ExternalLink } from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

export const TrelloTab = () => {
  const { realTimeData } = useAPIIntegrations();
  const trelloData = realTimeData.trello;

  if (!trelloData || !trelloData.boards) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Trello Data</h3>
          <p className="text-muted-foreground">
            Fetching your boards and cards from Trello...
          </p>
        </div>
      </div>
    );
  }

  const boards = trelloData.boards || [];
  const totalCards = trelloData.cards?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Trello Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your boards and track project progress
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Open Trello
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boards</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boards.length}</div>
            <p className="text-xs text-muted-foreground">
              Active project boards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">
              Cards across all boards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Boards</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {boards.filter(board => !board.closed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Open collaborative boards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Boards Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Boards</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boards.length > 0 ? (
            boards.map((board: any) => (
              <Card key={board.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{board.name}</CardTitle>
                    <Badge variant={board.closed ? "secondary" : "default"}>
                      {board.closed ? "Closed" : "Active"}
                    </Badge>
                  </div>
                  {board.desc && (
                    <CardDescription className="text-sm">
                      {board.desc.substring(0, 100)}
                      {board.desc.length > 100 ? "..." : ""}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Lists:</span>
                      <span>{board.lists?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Members:</span>
                      <span>{board.memberships?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Last Activity:</span>
                      <span>
                        {board.dateLastActivity 
                          ? new Date(board.dateLastActivity).toLocaleDateString()
                          : "N/A"
                        }
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => window.open(board.url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Board
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center p-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Boards Found</h3>
              <p className="text-muted-foreground">
                Create your first board in Trello to see it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
