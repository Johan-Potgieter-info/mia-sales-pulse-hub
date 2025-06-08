
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Eye, Edit, Share, Download, TrendingUp } from "lucide-react";

const mockDriveData = {
  summary: {
    totalDocuments: 248,
    viewsThisMonth: 1423,
    sharedDocuments: 89,
    collaborativeEdits: 156
  },
  topDocuments: [
    {
      id: 1,
      name: "Sales Proposal - Acme Corp.pdf",
      type: "proposal",
      views: 45,
      lastViewed: "2 hours ago",
      status: "active",
      client: "Acme Corp"
    },
    {
      id: 2,
      name: "Product Demo Deck Q2.pptx",
      type: "presentation",
      views: 89,
      lastViewed: "1 day ago",
      status: "active",
      client: "Multiple"
    },
    {
      id: 3,
      name: "Contract Template v2.1.docx",
      type: "contract",
      views: 23,
      lastViewed: "3 days ago",
      status: "updated",
      client: "Template"
    },
    {
      id: 4,
      name: "ROI Analysis - Tech Solutions.xlsx",
      type: "analysis",
      views: 15,
      lastViewed: "5 days ago",
      status: "shared",
      client: "Tech Solutions"
    }
  ],
  documentTypes: [
    { type: "Proposals", count: 45, engagement: 85 },
    { type: "Presentations", count: 32, engagement: 92 },
    { type: "Contracts", count: 28, engagement: 78 },
    { type: "Analysis", count: 18, engagement: 88 }
  ],
  clientEngagement: [
    { client: "Acme Corp", views: 145, documents: 8 },
    { client: "Tech Solutions", views: 89, documents: 5 },
    { client: "Global Industries", views: 67, documents: 4 },
    { client: "StartupCo", views: 34, documents: 3 }
  ]
};

export const GoogleDriveTab = () => {
  const { summary, topDocuments, documentTypes, clientEngagement } = mockDriveData;

  const getFileIcon = (type: string) => {
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      updated: "secondary",
      shared: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">In sales drive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views This Month</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.viewsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Document views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Documents</CardTitle>
            <Share className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.sharedDocuments}</div>
            <p className="text-xs text-muted-foreground">With clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborative Edits</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.collaborativeEdits}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Documents</CardTitle>
          <CardDescription>Documents with highest engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getFileIcon(doc.type)}
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">Client: {doc.client}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{doc.views}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{doc.lastViewed}</div>
                  {getStatusBadge(doc.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Types & Client Engagement */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Types Performance</CardTitle>
            <CardDescription>Engagement by document type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documentTypes.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.type}</span>
                  <span className="text-sm text-muted-foreground">{type.count} docs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={type.engagement} className="flex-1" />
                  <span className="text-sm text-muted-foreground">{type.engagement}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Engagement</CardTitle>
            <CardDescription>Document views by client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientEngagement.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{client.client}</h4>
                  <p className="text-sm text-muted-foreground">{client.documents} documents</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{client.views}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
