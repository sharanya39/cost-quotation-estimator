
import React from 'react';
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import ProjectSummary from "@/components/quotation/ProjectSummary";
import CostSummary from "@/components/quotation/CostSummary";
import CopyToClipboardButton from "@/components/quotation/CopyToClipboardButton";
import { FileText } from "lucide-react";

const FinalQuotation = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Cost Estimation - Final Quotation"
      previousPage="/quotation-cost"
      nextPage="/target-cost-estimation"
      nextButtonText="Continue to Target Cost Estimation"
    >
      <Navigation />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Final Quotation</h2>
          </div>
          <p className="text-gray-600">
            Review the final quotation details and download or copy them for your records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProjectSummary />
        </div>

        <CostSummary />

        <div className="flex justify-center mt-6">
          <CopyToClipboardButton />
        </div>
      </div>
    </PageLayout>
  );
};

export default FinalQuotation;
