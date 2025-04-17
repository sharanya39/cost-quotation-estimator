
import React from 'react';
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { replaceNonTechnicalSummary, NonTechnicalAnalysis } from './components/NonTechnicalAnalysis';

// Main component for Extract Details page
const ExtractDetails = () => {
  return (
    <PageLayout 
      title="Cost Estimation - Extract Details" 
      previousPage="/engineering-drawings"
      nextPage="/material-cost"
      nextButtonText="Continue to Material Cost"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Engineering Drawing Analysis</h2>
          <p className="text-gray-600">
            The system has analyzed the engineering drawings and extracted relevant details.
          </p>
        </div>

        <NonTechnicalAnalysis>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Non Technical Analysis</h3>
            <p>
              The engineering drawing provides comprehensive details about the component dimensions, 
              tolerances, and manufacturing requirements. The material specifications and 
              finishing requirements have been extracted to assist in cost estimation.
            </p>
          </div>
        </NonTechnicalAnalysis>
      </div>
    </PageLayout>
  );
};

export default ExtractDetails;
