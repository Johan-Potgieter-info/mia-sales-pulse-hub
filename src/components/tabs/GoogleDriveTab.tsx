
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSpreadsheet, 
  FileText, 
  FormInput, 
  FolderOpen, 
  ExternalLink, 
  Calendar,
  Download
} from "lucide-react";
import { useAPIIntegrations } from "@/hooks/useAPIIntegrations";

export const GoogleDriveTab = () => {
  const { realTimeData } = useAPIIntegrations();
  const driveData = realTimeData.googleDrive;

  if (!driveData) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Google Drive Data</h3>
          <p className="text-muted-foreground">
            Fetching your files from Google Drive...
          </p>
        </div>
      </div>
    );
  }

  const { files = [], sheets = [], forms = [], docs = [] } = driveData;

  const formatFileSize = (bytes: string | number) => {
    if (!bytes || bytes === '0') return 'N/A';
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let fileSize = size;
    while (fileSize >= 1024 && i < units.length - 1) {
      fileSize /= 1024;
      i++;
    }
    return `${fileSize.toFixed(1)} ${units[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Google Drive Dashboard</h2>
          <p className="text-muted-foreground">
            Access your Sheets, Forms, Documents and more
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Open Drive
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">All file types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spreadsheets</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sheets.length}</div>
            <p className="text-xs text-muted-foreground">Google Sheets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forms</CardTitle>
            <FormInput className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">Google Forms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{docs.length}</div>
            <p className="text-xs text-muted-foreground">Google Docs</p>
          </CardContent>
        </Card>
      </div>

      {/* File Categories */}
      <Tabs defaultValue="sheets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Sheets ({sheets.length})
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FormInput className="w-4 h-4" />
            Forms ({forms.length})
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Docs ({docs.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            All Files ({files.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sheets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sheets.length > 0 ? (
              sheets.map((file: any) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-green-500" />
                        {file.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(file.createdTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified:</span>
                        <span>{formatDate(file.modifiedTime)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => window.open(file.webViewLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Sheet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sheets Found</h3>
                <p className="text-muted-foreground">Create your first Google Sheet to see it here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.length > 0 ? (
              forms.map((file: any) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FormInput className="w-4 h-4 text-purple-500" />
                        {file.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(file.createdTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified:</span>
                        <span>{formatDate(file.modifiedTime)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => window.open(file.webViewLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <FormInput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Forms Found</h3>
                <p className="text-muted-foreground">Create your first Google Form to see it here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.length > 0 ? (
              docs.map((file: any) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {file.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{formatDate(file.createdTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified:</span>
                        <span>{formatDate(file.modifiedTime)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => window.open(file.webViewLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Doc
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
                <p className="text-muted-foreground">Create your first Google Doc to see it here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {files.length > 0 ? (
              files.map((file: any) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          {file.mimeType.includes('spreadsheet') && <FileSpreadsheet className="w-4 h-4 text-green-500" />}
                          {file.mimeType.includes('form') && <FormInput className="w-4 h-4 text-purple-500" />}
                          {file.mimeType.includes('document') && <FileText className="w-4 h-4 text-blue-500" />}
                          {!file.mimeType.includes('spreadsheet') && !file.mimeType.includes('form') && !file.mimeType.includes('document') && <FolderOpen className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(file.modifiedTime)} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(file.webViewLink, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Files Found</h3>
                <p className="text-muted-foreground">Your Google Drive files will appear here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
