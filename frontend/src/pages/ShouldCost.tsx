
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateL4Cost, formatINR } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ShouldCost = () => {
  const navigate = useNavigate();
  const { 
    materialItems, 
    currentItemIndex,
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
    l3CostPerPiece: 0
  };
  
  const [l4Costs, setL4Costs] = useState({
    l4CostPerKg: 0,
    l4CostPerPiece: 0
  });
  
  // Calculate L4 costs when component mounts or dependencies change
  useEffect(() => {
    const l4CostPerKg = calculateL4Cost(
      existingBreakdown.l3CostPerKg || 0,
      humanIntervention.commercialOverheadPercentage
    );
    
    const l4CostPerPiece = calculateL4Cost(
      existingBreakdown.l3CostPerPiece || 0,
      humanIntervention.commercialOverheadPercentage
    );
    
    setL4Costs({
      l4CostPerKg,
      l4CostPerPiece
    });
  }, [existingBreakdown, humanIntervention.commercialOverheadPercentage]);
  
  const handleSubmit = () => {
    // Update cost breakdown with L4 costs
    const updatedBreakdown = {
      ...existingBreakdown,
      l4CostPerKg: l4Costs.l4CostPerKg,
      l4CostPerPiece: l4Costs.l4CostPerPiece
    };
    
    const updatedBreakdowns = [...costBreakdowns];
    
    if (currentItemIndex < updatedBreakdowns.length) {
      updatedBreakdowns[currentItemIndex] = updatedBreakdown;
    } else {
      updatedBreakdowns.push(updatedBreakdown);
    }
    
    setCostBreakdowns(updatedBreakdowns);
    navigate("/quotation-cost");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Should Cost (L4)" 
      previousPage="/production-cost"
      nextPage="/quotation-cost"
      nextButtonText="Next: Quotation Cost (L5)"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Should Cost Calculation (L4)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            The Should Cost (L4) includes the production cost plus commercial overhead expenses.
          </p>
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Should Cost Formula</CardTitle>
            <CardDescription>L4 = L3 × (1 + Commercial Overhead %)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Production Cost (L3)</h3>
                <div>
                  <p className="text-sm text-gray-500">Per Kg</p>
                  <p className="text-xl font-medium">{formatINR(existingBreakdown.l3CostPerKg || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Per Piece</p>
                  <p className="text-xl font-medium">{formatINR(existingBreakdown.l3CostPerPiece || 0)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Commercial Overhead</h3>
                <div>
                  <p className="text-sm text-gray-500">Percentage</p>
                  <p className="text-xl font-medium">{humanIntervention.commercialOverheadPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm">Additional costs related to sales, administration, and other business operations</p>
                </div>
              </div>
              
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Should Cost (L4)</h3>
                <div>
                  <p className="text-sm text-gray-500">Per Kg</p>
                  <p className="text-2xl font-bold text-blue-800">{formatINR(l4Costs.l4CostPerKg)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Per Piece</p>
                  <p className="text-2xl font-bold text-blue-800">{formatINR(l4Costs.l4CostPerPiece)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Should Cost Summary</CardTitle>
            <CardDescription>L4 Cost Breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">L3 Cost:</div>
                <div>{formatINR(existingBreakdown.l3CostPerKg || 0)} per kg</div>
                
                <div className="text-sm font-medium">Commercial Overhead %:</div>
                <div>{humanIntervention.commercialOverheadPercentage}%</div>
                
                <div className="text-sm font-medium">L4 Should Cost per kg:</div>
                <div>{formatINR(l4Costs.l4CostPerKg)}</div>
                
                <div className="text-sm font-medium">Cost per piece:</div>
                <div>{formatINR(l4Costs.l4CostPerPiece)}</div>
                
                <div className="text-sm font-medium">Total for {currentItem?.quantity} pieces:</div>
                <div>{formatINR(l4Costs.l4CostPerPiece * (currentItem?.quantity || 1))}</div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">
                  The Should Cost represents what the item should cost to produce including all business overheads.
                  This is the basis for the final quotation cost with profit and negotiation margins added.
                </p>
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
            Continue to Quotation Cost (L5)
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ShouldCost;
