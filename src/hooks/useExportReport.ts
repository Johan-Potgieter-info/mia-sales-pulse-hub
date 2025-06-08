
import { useState } from 'react';
import { generatePDFReport } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export const useExportReport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportReport = async () => {
    setIsExporting(true);
    
    try {
      await generatePDFReport();
      
      toast({
        title: "Report Exported",
        description: "Your sales report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportReport,
    isExporting
  };
};
