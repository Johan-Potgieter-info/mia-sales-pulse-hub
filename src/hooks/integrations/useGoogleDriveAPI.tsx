
import { useCallback } from 'react';
import { FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APIIntegration } from '@/types/apiIntegrations';

export const useGoogleDriveAPI = () => {
  const { toast } = useToast();

  const connectGoogleDrive = useCallback(async (accessToken: string) => {
    try {
      console.log('Connecting to Google Drive API...');
      
      // Fetch files from Google Drive
      const filesResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=trashed=false&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink)',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!filesResponse.ok) {
        const errorText = await filesResponse.text();
        console.error('Google Drive API error:', filesResponse.status, errorText);
        throw new Error(`HTTP ${filesResponse.status}: ${errorText || 'Failed to connect to Google Drive'}`);
      }

      const filesData = await filesResponse.json();
      console.log('Google Drive files retrieved:', filesData.files?.length || 0);

      // Categorize files
      const sheets = filesData.files?.filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.spreadsheet'
      ) || [];
      
      const forms = filesData.files?.filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.form'
      ) || [];
      
      const docs = filesData.files?.filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.document'
      ) || [];

      const integration: APIIntegration = {
        id: 'google-drive',
        name: 'Google Drive',
        provider: 'google-drive',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        description: 'Cloud storage with Sheets, Forms, and Docs',
        icon: <FolderOpen className="w-4 h-4 text-blue-500" />,
        category: 'storage',
        accessToken,
        hasData: filesData.files?.length > 0,
        metrics: {
          'Total Files': filesData.files?.length || 0,
          'Sheets': sheets.length,
          'Forms': forms.length,
          'Docs': docs.length
        }
      };

      toast({
        title: "Google Drive Connected",
        description: `Successfully connected to Google Drive with ${filesData.files?.length || 0} files`,
      });

      return { 
        integration, 
        data: { 
          files: filesData.files,
          sheets,
          forms,
          docs
        } 
      };

    } catch (error) {
      console.error('Google Drive connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedIntegration: APIIntegration = {
        id: 'google-drive',
        name: 'Google Drive',
        provider: 'google-drive',
        status: 'error',
        lastSync: null,
        description: 'Cloud storage with Sheets, Forms, and Docs',
        icon: <FolderOpen className="w-4 h-4 text-red-500" />,
        category: 'storage',
        hasData: false,
        errorMessage
      };

      toast({
        title: "Google Drive Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return { integration: failedIntegration, data: null };
    }
  }, [toast]);

  return { connectGoogleDrive };
};
