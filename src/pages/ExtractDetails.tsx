import React from 'react';
import { replaceNonTechnicalSummary, NonTechnicalAnalysis } from './components/NonTechnicalAnalysis';

// Main component for Extract Details page
const ExtractDetails = () => {
  return (
    <div>
      {/* Any existing content will use NonTechnicalAnalysis component */}
      <NonTechnicalAnalysis>
        {/* Existing content that might use "Non technical summary" will be transformed */}
      </NonTechnicalAnalysis>
    </div>
  );
};

export default ExtractDetails;
