
export const mockSalesData = {
  kpis: {
    appointmentsBooked: 127,
    conversionRate: 24.8,
    dealValue: 486000,
    salesCycle: 32
  },
  
  monthlyRevenue: [
    { month: "Jan", revenue: 420000, forecast: 400000 },
    { month: "Feb", revenue: 380000, forecast: 420000 },
    { month: "Mar", revenue: 520000, forecast: 450000 },
    { month: "Apr", revenue: 480000, forecast: 480000 },
    { month: "May", revenue: 590000, forecast: 520000 },
    { month: "Jun", revenue: 620000, forecast: 580000 },
  ],

  pipeline: [
    { stage: "Lead", count: 45, value: 180000 },
    { stage: "Qualified", count: 28, value: 420000 },
    { stage: "Proposal", count: 15, value: 360000 },
    { stage: "Negotiation", count: 8, value: 240000 },
    { stage: "Closed Won", count: 12, value: 480000 },
  ],

  leadSources: [
    { name: "Website", value: 35, color: "#0ea5e9" },
    { name: "Referrals", value: 28, color: "#10b981" },
    { name: "Social Media", value: 20, color: "#f59e0b" },
    { name: "Email Campaign", value: 12, color: "#ef4444" },
    { name: "Cold Outreach", value: 5, color: "#8b5cf6" },
  ],

  recentActivity: [
    {
      type: "deal",
      title: "New deal closed - Acme Corp",
      description: "R 45,000 • 2 hours ago",
      status: "success"
    },
    {
      type: "meeting",
      title: "Meeting scheduled with Tech Solutions",
      description: "Tomorrow at 2:00 PM",
      status: "info"
    },
    {
      type: "followup",
      title: "Follow-up required - Global Industries",
      description: "Overdue by 1 day",
      status: "warning"
    }
  ]
};

export const generatePDFReport = async () => {
  // This would integrate with jsPDF to generate actual PDF reports
  // For now, we'll just simulate the process
  
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('Mia Sales Reporting Hub', 20, 30);
  doc.setFontSize(12);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 40);
  
  // Add KPI summary
  doc.setFontSize(16);
  doc.text('Key Performance Indicators', 20, 60);
  doc.setFontSize(12);
  doc.text(`Appointments Booked: ${mockSalesData.kpis.appointmentsBooked}`, 20, 75);
  doc.text(`Conversion Rate: ${mockSalesData.kpis.conversionRate}%`, 20, 85);
  doc.text(`Deal Value: R ${(mockSalesData.kpis.dealValue / 1000).toFixed(0)}K`, 20, 95);
  doc.text(`Sales Cycle: ${mockSalesData.kpis.salesCycle} days`, 20, 105);
  
  // Add pipeline summary
  doc.setFontSize(16);
  doc.text('Pipeline Summary', 20, 130);
  doc.setFontSize(12);
  
  let yPosition = 145;
  mockSalesData.pipeline.forEach((stage) => {
    doc.text(`${stage.stage}: ${stage.count} deals (R ${(stage.value / 1000).toFixed(0)}K)`, 20, yPosition);
    yPosition += 10;
  });
  
  // Save the PDF
  doc.save('mia-sales-report.pdf');
  
  return true;
};
