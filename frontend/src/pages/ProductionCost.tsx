
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateL3Cost, formatINR } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ProductionCost = () => {
  const navigate = useNavigate();
  const { 
    materialItems, 
    currentItemIndex,
    costBreakdowns,
    setCostBreakdowns
  } = useCostEstimation();
  
  const currentItem = materialItems[currentItemIndex];
  const existingBreakdown = costBreakdowns[currentItemIndex] || {
    l1CostPerKg: 0,
    l1CostPerPiece: 0,
    l2CostPerKg: 0,
    l2CostPerPiece: 0
  };
  
  const [l3Costs, setL3Costs] = useState({
    l3CostPerKg: 0,
    l3CostPerPiece: 0
  });
  
  // Calculate L3 costs when component mounts or dependencies change
  useEffect(() => {
    const l3CostPerKg = calculateL3Cost(
      existingBreakdown.l1CostPerKg || 0,
      existingBreakdown.l2CostPerKg || 0
    );
    
    const l3CostPerPiece = calculateL3Cost(
      existingBreakdown.l1CostPerPiece || 0,
      existingBreakdown.l2CostPerPiece || 0
    );
    
    setL3Costs({
      l3CostPerKg,
      l3CostPerPiece
    });
  }, [existingBreakdown]);
  
  const handleSubmit = () => {
    // Update cost breakdown with L3 costs
    const updatedBreakdown = {
      ...existingBreakdown,
      l3CostPerKg: l3Costs.l3CostPerKg,
      l3CostPerPiece: l3Costs.l3CostPerPiece
    };
    
    const updatedBreakdowns = [...costBreakdowns];
    
    if (currentItemIndex < updatedBreakdowns.length) {
      updatedBreakdowns[currentItemIndex] = updatedBreakdown;
    } else {
      updatedBreakdowns.push(updatedBreakdown);
    }
    
    setCostBreakdowns(updatedBreakdowns);
    navigate("/should-cost");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Production Cost (L3)" 
      previousPage="/manufacturing-cost-2"
      nextPage="/should-cost"
      nextButtonText="Next: Should Cost (L4)"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Production Cost Calculation (L3)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            Production cost (L3) is the sum of material cost (L1) and manufacturing cost (L2).
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* L1 Cost Card */}
          <Card>
            <CardHeader>
              <CardTitle>Material Cost (L1)</CardTitle>
              <CardDescription>Raw material and waste cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Per Kg</p>
                  <p className="text-2xl font-semibold">{formatINR(existingBreakdown.l1CostPerKg || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Per Piece</p>
                  <p className="text-2xl font-semibold">{formatINR(existingBreakdown.l1CostPerPiece || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* L2 Cost Card */}
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing Cost (L2)</CardTitle>
              <CardDescription>Processing and overhead cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Per Kg</p>
                  <p className="text-2xl font-semibold">{formatINR(existingBreakdown.l2CostPerKg || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Per Piece</p>
                  <p className="text-2xl font-semibold">{formatINR(existingBreakdown.l2CostPerPiece || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* L3 Production Cost Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Production Cost (L3)</CardTitle>
              <CardDescription>Total production cost (L1 + L2)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Per Kg</p>
                  <p className="text-3xl font-bold text-blue-700">{formatINR(l3Costs.l3CostPerKg)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Per Piece</p>
                  <p className="text-3xl font-bold text-blue-700">{formatINR(l3Costs.l3CostPerPiece)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Formula and Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Production Cost Formula</CardTitle>
            <CardDescription>L3 = L1 + L2</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="font-medium">Material Cost (L1)</p>
                  <ul className="text-sm space-y-1">
                    <li>Raw material cost including waste and firm price adjustments</li>
                    <li>L1 per kg: {formatINR(existingBreakdown.l1CostPerKg || 0)}</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Manufacturing Cost (L2)</p>
                  <ul className="text-sm space-y-1">
                    <li>Setup and cycle costs with overheads</li>
                    <li>Additional painting, inspection, and packaging</li>
                    <li>L2 per kg: {formatINR(existingBreakdown.l2CostPerKg || 0)}</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Production Cost (L3)</p>
                  <ul className="text-sm space-y-1">
                    <li>The total production cost</li>
                    <li>L3 per kg: {formatINR(l3Costs.l3CostPerKg)}</li>
                    <li>L3 per piece: {formatINR(l3Costs.l3CostPerPiece)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            className="flex items-center"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue to Should Cost (L4)
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductionCost;
