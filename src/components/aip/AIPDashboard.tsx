
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Search, 
  Download, 
  Filter, 
  Calendar,
  FileText,
  Trello,
  Users,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";
import { generateAIInsight } from "@/utils/aiService";
import { useToast } from "@/hooks/use-toast";

export const AIPDashboard = () => {
  const { integrations, realTimeData, refreshIntegration } = useAPIIntegrations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('all');
  const [aiQuery, setAIQuery] = useState('');
  const [aiInsight, setAIInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const { toast } = useToast();

  // Get all data across integrations
  const getAllData = () => {
    const allData: any[] = [];
    
    // Trello data
    if (realTimeData.trello) {
      realTimeData.trello.boards?.forEach(board => {
        allData.push({
          type: 'trello_board',
          integration: 'Trello',
          title: board.name,
          content: board.desc || 'Trello board',
          data: board,
          timestamp: board.dateLastActivity
        });
      });
      
      realTimeData.trello.cards?.forEach(card => {
        allData.push({
          type: 'trello_card',
          integration: 'Trello',
          title: card.name,
          content: card.desc || 'Trello card',
          data: card,
          timestamp: card.dateLastActivity
        });
      });
    }

    // Google Calendar data
    if (realTimeData.googleCalendar?.events) {
      realTimeData.googleCalendar.events.forEach(event => {
        allData.push({
          type: 'calendar_event',
          integration: 'Google Calendar',
          title: event.summary || 'Calendar Event',
          content: event.description || 'Calendar event',
          data: event,
          timestamp: event.start?.dateTime || event.start?.date
        });
      });
    }

    // Calendly data
    if (realTimeData.calendly) {
      realTimeData.calendly.eventTypes?.forEach(eventType => {
        allData.push({
          type: 'calendly_event_type',
          integration: 'Calendly',
          title: eventType.name,
          content: eventType.description_plain || 'Calendly event type',
          data: eventType,
          timestamp: eventType.updated_at
        });
      });

      realTimeData.calendly.scheduledEvents?.forEach(event => {
        allData.push({
          type: 'calendly_scheduled_event',
          integration: 'Calendly',
          title: event.name || 'Scheduled Meeting',
          content: 'Calendly scheduled event',
          data: event,
          timestamp: event.start_time
        });
      });
    }

    // Google Drive data
    if (realTimeData.googleDrive) {
      realTimeData.googleDrive.files?.forEach(file => {
        allData.push({
          type: 'google_drive_file',
          integration: 'Google Drive',
          title: file.name,
          content: `${file.mimeType} file`,
          data: file,
          timestamp: file.modifiedTime
        });
      });
    }

    return allData;
  };

  // Filter data based on search and integration
  const filteredData = getAllData().filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIntegration = selectedIntegration === 'all' || 
      item.integration.toLowerCase() === selectedIntegration.toLowerCase();

    return matchesSearch && matchesIntegration;
  });

  // Get AI insight
  const getAIInsight = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to get AI insights",
        variant: "destructive"
      });
      return;
    }

    setLoadingInsight(true);
    try {
      const insight = await generateAIInsight(aiQuery);
      setAIInsight(insight.content);
    } catch (error) {
      console.error('AI insight error:', error);
      toast({
        title: "AI Insight Error",
        description: "Failed to generate AI insight. Please check your AI API connection.",
        variant: "destructive"
      });
    } finally {
      setLoadingInsight(false);
    }
  };

  // Export data as JSON
  const exportData = () => {
    const dataBlob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aip-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: `Exported ${filteredData.length} items to JSON file`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trello_board':
      case 'trello_card':
        return <Trello className="w-4 h-4" />;
      case 'calendar_event':
      case 'calendly_event_type':
      case 'calendly_scheduled_event':
        return <Calendar className="w-4 h-4" />;
      case 'google_drive_file':
        return <FileText className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8 text-orange-500" />
            API Integration Platform (AIP)
          </h1>
          <p className="text-muted-foreground">
            Access and analyze data from all your connected APIs
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected APIs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Active integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAllData().length}</div>
            <p className="text-xs text-muted-foreground">
              Across all APIs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trello Items</CardTitle>
            <Trello className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(realTimeData.trello?.boards?.length || 0) + (realTimeData.trello?.cards?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Boards and cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(realTimeData.googleCalendar?.events?.length || 0) + (realTimeData.calendly?.scheduledEvents?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All calendar events
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data">Data Explorer</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="integrations">Manage APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search across all your data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Integrations</option>
              <option value="trello">Trello</option>
              <option value="google calendar">Google Calendar</option>
              <option value="calendly">Calendly</option>
              <option value="google drive">Google Drive</option>
            </select>
          </div>

          {/* Data Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.length === 0 ? (
              <div className="col-span-full text-center p-8">
                <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Data Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No data matches your search criteria' : 'Connect some APIs to see data here'}
                </p>
              </div>
            ) : (
              filteredData.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <CardTitle className="text-sm">{item.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.integration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs mb-2">
                      {item.content.substring(0, 100)}
                      {item.content.length > 100 ? '...' : ''}
                    </CardDescription>
                    {item.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Data Analysis</CardTitle>
              <CardDescription>
                Ask questions about your integrated data and get AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your data... (e.g., 'What are my upcoming deadlines?')"
                  value={aiQuery}
                  onChange={(e) => setAIQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getAIInsight()}
                />
                <Button onClick={getAIInsight} disabled={loadingInsight}>
                  {loadingInsight ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
              
              {aiInsight && (
                <Alert>
                  <AlertDescription className="whitespace-pre-wrap">
                    {aiInsight}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map(integration => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {integration.icon}
                      {integration.name}
                    </CardTitle>
                    <Badge variant={integration.status === 'connected' ? 'default' : 'destructive'}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    {Object.entries(integration.metrics || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => refreshIntegration(integration.id)}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
