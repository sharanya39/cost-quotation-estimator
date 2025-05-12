
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NonTechnicalAnalysis } from './components/NonTechnicalAnalysis';
// import TechnologyLogos from './components/TechnologyLogos'; // Removed as per instructions
import ViewTypeToggle from './components/ViewTypeToggle';
import TechnicalDetailsCard from './components/TechnicalDetailsCard';

const ExtractDetails = () => {
  const navigate = useNavigate();
  var { engineeringDetails, setEngineeringDetails, accessLevel } = useCostEstimation();
  accessLevel = 'premium';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/op-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Find bounding dimensions
        const boundingDims = data.dimensions.filter((dim: any) => dim.is_bounding_dimension);
        const [length, width, thickness] = boundingDims.map((dim: any) => parseFloat(dim.dimension));
        
        // Compile holes information
        const holesInfo = data.holes.map((hole: any) => 
          `${hole.quantity}x Ø${hole.diameter_mm}mm ${hole.hole_type} holes`
        ).join(', ');

        // Compile tolerances
        const tolerances = data.dimensions
          .map((dim: any) => `${dim.dimension}mm ${dim.tolerance}`)
          .join(', ');

        setEngineeringDetails([{
          title: data.part_name,
          drawingNumber: data.drawing_number,
          length,
          width,
          thickness,
          holesSizesAndPosition: holesInfo,
          tolerances,
          scaleAndRevision: `Rev ${data.revision}`,
          authors: 'System Generated',
          material: data.material,
          surfaceTreatment: data.surface_treatment
        }]);
      } catch (error) {
        console.error('Error loading op-data:', error);
        setError('Failed to load engineering details. Please try again.');
        setEngineeringDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpData();
  }, [setEngineeringDetails]);
  const [viewType, setViewType] = useState<'technical' | 'non-technical'>('technical');

  const handleContinue = () => {
    if (viewType === 'technical') {
      if (accessLevel === 'premium') {
        navigate('/material-cost');
      } else {
        navigate('/plans');
      }
    } else {
      navigate('/final-quotation');
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
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Extract Details</h2>
        </div>

        <p className="text-gray-600 mb-6">
          The system has analyzed the engineering drawings and extracted relevant details from the provided specifications.
        </p>

        {/* Removed TechnologyLogos as per user request */}

        <ViewTypeToggle 
          viewType={viewType} 
          onViewTypeChange={setViewType}
        />

        {viewType === 'technical' ? (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : engineeringDetails.length > 0 ? (
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
              <p className="mt-4">
                Based on the drawings analysis, we've identified key manufacturing considerations
                that will affect cost estimation. These include precision tolerances, 
                material selection, and specialized machining operations.
              </p>
            </div>
          </NonTechnicalAnalysis>
        )}

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3"
          >
            <FileText className="h-4 w-4" />
            {viewType === 'technical' 
              ? (accessLevel === 'premium' ? "Continue to Material Cost" : "Upgrade to Premium")
              : "View Final Quotation"
            }
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtractDetails;
