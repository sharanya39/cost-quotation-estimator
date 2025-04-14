
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateL5Cost } from "@/utils/calculations";
import { exportToExcel } from "@/utils/exportUtils";

import QuotationFormula from "./components/QuotationFormula";
import QuotationResults from "./components/QuotationResults";
import CostSummaryTable from "./components/CostSummaryTable";
import ActionButtons from "./components/ActionButtons";

const QuotationCost = () => {
  const navigate = useNavigate();
  const { 
    materialItems, 
    currentItemIndex,
    setCurrentItemIndex,
    humanIntervention,
    costBreakdowns,
    setCostBreakdowns
  } = useCostEstimation();
  
  const currentItem = materialItems[currentItemIndex];
  const existingBreakdown = costBreakdowns[currentItemIndex] || {
    l1CostPerKg: 0,
    l1CostPerPiece: 0,
    l2CostPerKg: 0,
    l2CostPerPiece: 0,
    l3CostPerKg: 0,
    l3CostPerPiece: 0,
    l4CostPerKg: 0,
    l4CostPerPiece: 0
  };
  
  const [l5Costs, setL5Costs] = useState({
    l5CostPerKg: 0,
    l5CostPerPiece: 0,
    totalQuotationCost: 0
  });
  
  useEffect(() => {
    const l5CostPerKg = calculateL5Cost(
      existingBreakdown.l4CostPerKg || 0,
      humanIntervention.profitMarginPercentage,
      humanIntervention.negotiationPercentage,
      humanIntervention.freightPerKg
    );
    
    const l5CostPerPiece = l5CostPerKg * (currentItem?.unitWeight || 1);
    const totalQuotationCost = l5CostPerPiece * (currentItem?.quantity || 1);
    
    setL5Costs({
      l5CostPerKg,
      l5CostPerPiece,
      totalQuotationCost
    });
  }, [
    existingBreakdown, 
    humanIntervention.profitMarginPercentage,
    humanIntervention.negotiationPercentage,
    humanIntervention.freightPerKg,
    currentItem
  ]);
  
  const handleSaveQuotation = () => {
    const updatedBreakdown = {
      ...existingBreakdown,
      l5CostPerKg: l5Costs.l5CostPerKg,
      l5CostPerPiece: l5Costs.l5CostPerPiece,
      totalQuotationCost: l5Costs.totalQuotationCost
    };
    
    const updatedBreakdowns = [...costBreakdowns];
    
    if (currentItemIndex < updatedBreakdowns.length) {
      updatedBreakdowns[currentItemIndex] = updatedBreakdown;
    } else {
      updatedBreakdowns.push(updatedBreakdown);
    }
    
    setCostBreakdowns(updatedBreakdowns);
  };
  
  const handleNextItem = () => {
    handleSaveQuotation();
    
    if (currentItemIndex < materialItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      alert("All items have been processed. You can now download the final quotation.");
    }
  };
  
  const handleDownload = () => {
    handleSaveQuotation();
    exportToExcel(materialItems, costBreakdowns);
  };
  
  const handleStartNew = () => {
    navigate("/");
  };
  
  const handleGoToBOM = () => {
    navigate("/bill-of-materials");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Quotation Cost (L5)" 
      previousPage="/should-cost"
      showNavigation={false}
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Quotation Cost Calculation (L5)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            The final Quotation Cost (L5) includes the should cost plus profit margin, negotiation margin, and freight.
          </p>
        </div>
        
        <QuotationFormula />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuotationResults l5Costs={l5Costs} />
        </div>
        
        <CostSummaryTable 
          existingBreakdown={existingBreakdown}
          l5Costs={l5Costs}
          quantity={currentItem?.quantity || 0}
        />
        
        <ActionButtons 
          onStartNew={handleStartNew}
          onGoToBOM={handleGoToBOM}
          onNextItem={handleNextItem}
          onDownload={handleDownload}
          isLastItem={currentItemIndex >= materialItems.length - 1}
        />
      </div>
    </PageLayout>
  );
};

export default QuotationCost;
