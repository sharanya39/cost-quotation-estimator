
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateBaseManufacturingCost, formatINR } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowRight } from "lucide-react";

const ManufacturingCost2 = () => {
  const navigate = useNavigate();
  const { 
    materialItems, 
    currentItemIndex,
    humanIntervention,
    manufacturingProcesses,
    costBreakdowns,
    setCostBreakdowns
  } = useCostEstimation();
  
  const currentItem = materialItems[currentItemIndex];
  
  // Calculate totals from manufacturing processes
  const setupCostPerPiece = manufacturingProcesses.reduce(
    (sum, process) => sum + process.setupCost,
    0
  );
  
  const cycleCostPerPiece = manufacturingProcesses.reduce(
    (sum, process) => sum + process.cycleCost,
    0
  );
  
  // Per kg calculations
  const weight = currentItem?.unitWeight || 1;
  const setupCostPerKg = setupCostPerPiece / weight;
  const cycleCostPerKg = cycleCostPerPiece / weight;
  
  const [inputs, setInputs] = useState({
    setupCostPerKg,
    cycleCostPerKg,
    overheadPercentage: humanIntervention.overheadPercentage,
    paintingCostPerKg: 2,
    inspectionCostPerKg: 5,
    packagingCostPerKg: 5
  });
  
  const [baseManufacturingCost, setBaseManufacturingCost] = useState({
    perKg: 0,
    perPiece: 0
  });
  
  // Recalculate whenever inputs change
  useEffect(() => {
    const costPerKg = calculateBaseManufacturingCost(
      inputs.setupCostPerKg,
      inputs.cycleCostPerKg,
      inputs.overheadPercentage,
      inputs.paintingCostPerKg,
      inputs.inspectionCostPerKg,
      inputs.packagingCostPerKg
    );
    
    const costPerPiece = costPerKg * weight;
    
    setBaseManufacturingCost({
      perKg: costPerKg,
      perPiece: costPerPiece
    });
  }, [inputs, weight]);
  
  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = () => {
    // Get existing cost breakdown or initialize if it doesn't exist
    const existingBreakdownIndex = costBreakdowns.findIndex(
      (_, index) => index === currentItemIndex
    );
    
    let updatedBreakdown;
    
    if (existingBreakdownIndex >= 0) {
      updatedBreakdown = {
        ...costBreakdowns[existingBreakdownIndex],
        l2CostPerKg: baseManufacturingCost.perKg,
        l2CostPerPiece: baseManufacturingCost.perPiece
      };
    } else {
      updatedBreakdown = {
        l1CostPerKg: 0,
        l1CostPerPiece: 0,
        l2CostPerKg: baseManufacturingCost.perKg,
        l2CostPerPiece: baseManufacturingCost.perPiece
      };
    }
    
    const updatedBreakdowns = [...costBreakdowns];
    
    if (existingBreakdownIndex >= 0) {
      updatedBreakdowns[existingBreakdownIndex] = updatedBreakdown;
    } else {
      updatedBreakdowns.push(updatedBreakdown);
    }
    
    setCostBreakdowns(updatedBreakdowns);
    navigate("/production-cost");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Manufacturing Cost 2" 
      previousPage="/manufacturing-cost-1"
      nextPage="/production-cost"
      nextButtonText="Next: Production Cost (L3)"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Manufacturing Cost Calculation (L2)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            Calculate the total manufacturing cost based on setup, cycle times, and additional costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Manufacturing Cost Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="setupCostPerKg">Setup Cost Per Kg (₹)</Label>
                  <Input 
                    id="setupCostPerKg"
                    type="number"
                    value={inputs.setupCostPerKg.toFixed(2)}
                    onChange={(e) => handleInputChange("setupCostPerKg", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From Manufacturing Cost 1 calculations.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cycleCostPerKg">Cycle Cost Per Kg (₹)</Label>
                  <Input 
                    id="cycleCostPerKg"
                    type="number"
                    value={inputs.cycleCostPerKg.toFixed(2)}
                    onChange={(e) => handleInputChange("cycleCostPerKg", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From Manufacturing Cost 1 calculations.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="overheadPercentage">Overhead Percentage (%)</Label>
                  <Input 
                    id="overheadPercentage"
                    type="number"
                    value={inputs.overheadPercentage}
                    onChange={(e) => handleInputChange("overheadPercentage", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From human intervention settings.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="paintingCostPerKg">Painting Cost Per Kg (₹)</Label>
                  <Input 
                    id="paintingCostPerKg"
                    type="number"
                    value={inputs.paintingCostPerKg}
                    onChange={(e) => handleInputChange("paintingCostPerKg", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="inspectionCostPerKg">Inspection Cost Per Kg (₹)</Label>
                  <Input 
                    id="inspectionCostPerKg"
                    type="number"
                    value={inputs.inspectionCostPerKg}
                    onChange={(e) => handleInputChange("inspectionCostPerKg", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="packagingCostPerKg">Packaging Cost Per Kg (₹)</Label>
                  <Input 
                    id="packagingCostPerKg"
                    type="number"
                    value={inputs.packagingCostPerKg}
                    onChange={(e) => handleInputChange("packagingCostPerKg", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>L2 Cost Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Base Manufacturing Cost Per Kg</Label>
                  <div className="text-3xl font-semibold">{formatINR(baseManufacturingCost.perKg)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Base Manufacturing Cost Per Piece</Label>
                  <div className="text-3xl font-semibold">{formatINR(baseManufacturingCost.perPiece)}</div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p className="font-medium">Calculation Formula:</p>
                  <p>L2 = ((Setup + Cycle) × Overhead %) + Painting + Inspection + Packaging</p>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full mt-4 flex items-center justify-center"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to Production Cost
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManufacturingCost2;
