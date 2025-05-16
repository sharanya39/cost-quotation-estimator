
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import QuotationSummaryTable from "@/components/quotation/QuotationSummaryTable";
import { FileText, Home, ArrowRight, Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportUtils";
import { exportToPDF } from "@/utils/pdfUtils";

// Numbers will be shown as formatted amounts where needed.
const FinalQuotation = () => {
  const {
    projectDetails,
    materialItems,
    costBreakdowns,
    humanIntervention,
  } = useCostEstimation();

  const navigate = useNavigate();

  // Fix: All values must be number, not string. Format only for display.
  const summaryTableData = materialItems.map((item, idx) => ({
    partNumber: String(item.itemPartNumber || item.itemNumber),
    description: item.itemDescription,
    weight: item.unitWeight,
    quantity: item.quantity,
    l1Cost: Number((costBreakdowns[idx]?.l1CostPerKg ?? 0).toFixed(2)),
    l2Cost: Number((costBreakdowns[idx]?.l2CostPerKg ?? 0).toFixed(2)),
    l3Cost: Number((costBreakdowns[idx]?.l3CostPerKg ?? 0).toFixed(2)),
    l4Cost: Number((costBreakdowns[idx]?.l4CostPerKg ?? 0).toFixed(2)),
    l5Cost: Number((costBreakdowns[idx]?.l5CostPerKg ?? 0).toFixed(2)),
    totalPerPiece: Number((costBreakdowns[idx]?.l5CostPerPiece ?? 0).toFixed(2)),
    freight: Number((humanIntervention.freightPerKg ?? 0).toFixed(2))
  }));

  // Button handlers
  const handleNewEstimation = () => {
    navigate("/");
    // Can also reset context if required, but reset is not specified.
  };

  const handleNextBOM = () => {
    if (materialItems.length > 1) {
      navigate("/bill-of-materials");
    } else {
      toast.info("This is last item in the Bill of Materials");
    }
  };

  const handleDownloadExcel = () => {
    // Use export utility to download the summary table.
    exportToExcel(materialItems, costBreakdowns, humanIntervention);
  };

  const handleDownloadPDF = () => {
    exportToPDF(materialItems, costBreakdowns, humanIntervention, projectDetails);
  };
  const handleFinalQuotationCost = () => {
    // Logic: start over and go home (as a reset for a new process)
    navigate("/");
  };

  return (
    <PageLayout
      title="Cost Estimation - Final Quotation"
      previousPage="/quotation-cost"
      // Remove "Continue to Target Cost Estimation" and nextPage logic
    >
      <Navigation />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Final Quotation</h2>
        </div>

        {/* --- Two column summary blocks --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-green-50 rounded-xl p-6">
          {/* Customer Info Block */}
          <div className="rounded-xl bg-green-100 p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-green-900">Customer Information</h3>
            <ul className="text-green-900">
              <li><span className="font-semibold">Customer Name:</span> {projectDetails.customerName || "—"}</li>
              <li><span className="font-semibold">Customer ID:</span> {projectDetails.customerId || "—"}</li>
              <li><span className="font-semibold">Project Name:</span> {projectDetails.projectName || "—"}</li>
              <li><span className="font-semibold">Project ID:</span> {projectDetails.projectId || "—"}</li>
              <li><span className="font-semibold">Location:</span> {projectDetails.location || "—"}</li>
              <li><span className="font-semibold">Firm Price:</span> {projectDetails.firmPrice ? "Yes" : "No"}</li>
            </ul>
          </div>
          {/* Estimation Summary Block */}
          <div className="rounded-xl bg-green-100 p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-green-900">Estimation Summary</h3>
            <ul className="text-green-900">
              <li><span className="font-semibold">Total Items:</span> {materialItems.length}</li>
              <li><span className="font-semibold">Estimation Date:</span> {new Date().toLocaleDateString('en-GB')}</li>
              <li><span className="font-semibold">Total Quantity:</span> {materialItems.reduce((a, c) => a + (c.quantity || 0), 0)} pieces</li>
              <li><span className="font-semibold">Total Weight:</span> {materialItems.reduce((a, c) => a + ((c.unitWeight || 0) * (c.quantity || 0)), 0).toFixed(2)} kg</li>
            </ul>
          </div>
        </div>

        {/* --- Quotation Details Table Block --- */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-green-900">Quotation Details</h3>
          <QuotationSummaryTable items={summaryTableData} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end mt-6">
          <Button onClick={handleNewEstimation} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            New Estimation cost
          </Button>
          <Button onClick={handleNextBOM} variant="outline">
            <ArrowRight className="h-4 w-4 mr-2" />
            Next Estimation in the BOM
          </Button>
          <Button onClick={handleDownloadExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
          {/* <Button onClick={handleDownloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button> */}

          <Button onClick={handleFinalQuotationCost}>
            <DollarSign className="h-4 w-4 mr-2" /> Final quotation cost
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};
export default FinalQuotation;
