
import React from 'react';
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import ProjectSummary from "@/components/quotation/ProjectSummary";
import CostSummary from "@/components/quotation/CostSummary";
import CopyToClipboardButton from "@/components/quotation/CopyToClipboardButton";

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
          <h2 className="text-2xl font-bold">Final Quotation</h2>
          <p className="text-gray-600">
            Review the final quotation details and copy them to your clipboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectSummary />
          <CostSummary />
        </div>

        <CopyToClipboardButton />
      </div>
    </PageLayout>
  );
};

export default FinalQuotation;
