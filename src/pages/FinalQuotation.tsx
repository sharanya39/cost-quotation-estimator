
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import QuotationSummaryTable from "@/components/quotation/QuotationSummaryTable";
import { FileText } from "lucide-react";

const FinalQuotation = () => {
  const {
    projectDetails,
    materialItems,
    costBreakdowns,
    humanIntervention,
  } = useCostEstimation();

  // Mock values for demonstration, extract from context/materialItems as necessary
  const summaryTableData = materialItems.map((item, idx) => ({
    partNumber: item.itemPartNumber || item.itemNumber,
    description: item.itemDescription,
    weight: item.unitWeight,
    quantity: item.quantity,
    l1Cost: costBreakdowns[idx]?.l1CostPerKg ? `₹${costBreakdowns[idx].l1CostPerKg.toFixed(2)}` : "—",
    l2Cost: costBreakdowns[idx]?.l2CostPerKg ? `₹${costBreakdowns[idx].l2CostPerKg.toFixed(2)}` : "—",
    l3Cost: costBreakdowns[idx]?.l3CostPerKg ? `₹${costBreakdowns[idx].l3CostPerKg.toFixed(2)}` : "—",
    l4Cost: costBreakdowns[idx]?.l4CostPerKg ? `₹${costBreakdowns[idx].l4CostPerKg.toFixed(2)}` : "—",
    l5Cost: costBreakdowns[idx]?.l5CostPerKg ? `₹${costBreakdowns[idx].l5CostPerKg.toFixed(2)}` : "—",
    totalPerPiece: costBreakdowns[idx]?.l5CostPerPiece ? `₹${costBreakdowns[idx].l5CostPerPiece.toFixed(2)}` : "—",
    freight: humanIntervention.freightPerKg ? `₹${humanIntervention.freightPerKg.toFixed(2)}` : "—"
  }));

  return (
    <PageLayout
      title="Cost Estimation - Final Quotation"
      previousPage="/quotation-cost"
      nextPage="/target-cost-estimation"
      nextButtonText="Continue to Target Cost Estimation"
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
      </div>
    </PageLayout>
  );
};
export default FinalQuotation;
