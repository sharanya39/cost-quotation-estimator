
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NonTechnicalAnalysis } from './components/NonTechnicalAnalysis';
import TechnologyLogos from './components/TechnologyLogos';
import ViewTypeToggle from './components/ViewTypeToggle';
import TechnicalDetailsCard from './components/TechnicalDetailsCard';

const ExtractDetails = () => {
  const navigate = useNavigate();
  const { engineeringDetails, accessLevel } = useCostEstimation();
  const [viewType, setViewType] = useState<'technical' | 'non-technical'>('non-technical');

  const handleContinue = () => {
    if (accessLevel === 'premium') {
      navigate('/material-cost');
    } else {
      navigate('/plans');
    }
  };

  return (
    <PageLayout 
      title="Cost Estimation - Extract Details" 
      previousPage="/engineering-drawings"
      nextPage={accessLevel === 'premium' ? "/material-cost" : "/plans"}
      nextButtonText={accessLevel === 'premium' ? "Continue to Material Cost" : "Upgrade to Premium"}
      checkPremium={true}
      onNext={handleContinue}
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Engineering Drawing Analysis</h2>
          </div>
          <p className="text-gray-600">
            The system has analyzed the engineering drawings and extracted relevant details.
          </p>
        </div>

        <TechnologyLogos />
        
        <ViewTypeToggle 
          viewType={viewType} 
          onViewTypeChange={setViewType}
        />

        {viewType === 'technical' ? (
          <div className="space-y-6">
            {engineeringDetails.length > 0 ? (
              engineeringDetails.map((detail, index) => (
                <TechnicalDetailsCard 
                  key={index} 
                  detail={detail} 
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No engineering details available. Please upload engineering drawings.
              </div>
            )}
          </div>
        ) : (
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
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleContinue}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {accessLevel === 'premium' 
              ? "Continue to Material Cost" 
              : "Upgrade to Premium for Material Cost Estimation"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtractDetails;
