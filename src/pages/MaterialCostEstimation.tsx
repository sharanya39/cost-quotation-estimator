
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation, materialTable } from "@/contexts/CostEstimationContext";
import { extractMedianPrice, calculateL1Cost, formatINR } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText } from "lucide-react";

const MaterialCostEstimation = () => {
  const navigate = useNavigate();
  const { 
    materialItems, 
    currentItemIndex,
    engineeringDetails,
    humanIntervention,
    costBreakdowns,
    setCostBreakdowns
  } = useCostEstimation();
  
  const currentItem = materialItems[currentItemIndex];
  
  // Find material details for the current item
  const currentMaterialInfo = materialTable.find(
    material => material.title.toLowerCase().includes(currentItem?.itemDescription.toLowerCase() || "")
  );
  
  // Extract engineering details for the current item
  const currentEngDetails = engineeringDetails.find(
    detail => detail.title.toLowerCase().includes(currentItem?.itemDescription.toLowerCase() || "")
  );
  
  const [calculationInputs, setCalculationInputs] = useState({
    materialGrade: currentMaterialInfo?.material || "Not specified",
    pricePerKg: extractMedianPrice(currentMaterialInfo?.priceRange || "₹0"),
    partWeight: currentItem?.unitWeight || 0,
    wastePercentage: humanIntervention.wastePercentage,
    firmPricePercentage: humanIntervention.firmPricePercentage
  });
  
  const [l1Costs, setL1Costs] = useState({
    l1CostPerKg: 0,
    l1CostPerPiece: 0
  });
  
  // Recalculate whenever inputs change
  useEffect(() => {
    calculateCosts();
  }, [calculationInputs]);
  
  const handleInputChange = (field: string, value: string | number) => {
    setCalculationInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) : value
    }));
  };
  
  const calculateCosts = () => {
    const l1CostPerKg = calculateL1Cost(
      1, // Per kg calculation
      calculationInputs.wastePercentage,
      calculationInputs.pricePerKg,
      calculationInputs.firmPricePercentage
    );
    
    const l1CostPerPiece = l1CostPerKg * calculationInputs.partWeight;
    
    setL1Costs({
      l1CostPerKg,
      l1CostPerPiece
    });
  };
  
  const handleSubmit = () => {
    // Update or add cost breakdown for this item
    const existingBreakdownIndex = costBreakdowns.findIndex(
      (_, index) => index === currentItemIndex
    );
    
    const newBreakdown = {
      ...costBreakdowns[existingBreakdownIndex] || {},
      l1CostPerKg: l1Costs.l1CostPerKg,
      l1CostPerPiece: l1Costs.l1CostPerPiece
    };
    
    const updatedBreakdowns = [...costBreakdowns];
    
    if (existingBreakdownIndex >= 0) {
      updatedBreakdowns[existingBreakdownIndex] = newBreakdown;
    } else {
      updatedBreakdowns.push(newBreakdown);
    }
    
    setCostBreakdowns(updatedBreakdowns);
    navigate("/manufacturing-cost-1");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Material Cost (L1)" 
      previousPage="/extract-details"
      nextPage="/manufacturing-cost-1"
      nextButtonText="Next: Manufacturing Cost"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Material Cost Estimation (L1)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            Calculate the L1 cost based on material specifications, waste percentage, and firm price adjustments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="materialGrade">Material Grade</Label>
                  <Input 
                    id="materialGrade"
                    value={calculationInputs.materialGrade}
                    onChange={(e) => handleInputChange("materialGrade", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Selected from engineering details.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="pricePerKg">Price Per Kg (₹)</Label>
                  <Input 
                    id="pricePerKg"
                    type="number"
                    value={calculationInputs.pricePerKg}
                    onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Median price from reference data.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="partWeight">Part Weight (kg)</Label>
                  <Input 
                    id="partWeight"
                    type="number"
                    value={calculationInputs.partWeight}
                    onChange={(e) => handleInputChange("partWeight", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Weight per single item.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="wastePercentage">Waste Percentage (%)</Label>
                  <Input 
                    id="wastePercentage"
                    type="number"
                    value={calculationInputs.wastePercentage}
                    onChange={(e) => handleInputChange("wastePercentage", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From human intervention settings.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="firmPricePercentage">Firm Price Percentage (%)</Label>
                  <Input 
                    id="firmPricePercentage"
                    type="number"
                    value={calculationInputs.firmPricePercentage}
                    onChange={(e) => handleInputChange("firmPricePercentage", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From human intervention settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>L1 Cost Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">L1 Cost Per Kg</Label>
                  <div className="text-3xl font-semibold">{formatINR(l1Costs.l1CostPerKg)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">L1 Cost Per Piece</Label>
                  <div className="text-3xl font-semibold">{formatINR(l1Costs.l1CostPerPiece)}</div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p className="font-medium">Calculation Formula:</p>
                  <p>L1 = (Part Weight × Waste %) × Material Price × Firm Price %</p>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full mt-4 flex items-center justify-center"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Continue to Manufacturing Cost
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default MaterialCostEstimation;
