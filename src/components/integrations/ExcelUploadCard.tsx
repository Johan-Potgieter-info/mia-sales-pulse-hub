import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { integrationService } from "@/services/integrationService";

export const ExcelUploadCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setFile(newFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const integration = await integrationService.createIntegration(
        file.name,
        "excel-upload",
        "data",
        {}
      );
      await integrationService.storeIntegrationData(
        integration.id,
        "excel_data",
        json
      );
      setMessage("File uploaded successfully");
      setFile(null);
    } catch (error) {
      console.error("Excel upload error", error);
      setMessage("Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Excel Data</CardTitle>
        <CardDescription>
          Upload Excel files to analyze them with your connected APIs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file || isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
};
