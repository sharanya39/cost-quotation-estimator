
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateL5Cost, formatINR } from "@/utils/calculations";
import { exportToExcel } from "@/utils/exportUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Download, FileText, RefreshCw, ChevronRight } from "lucide-react";

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
  
  // Calculate L5 costs when component mounts or dependencies change
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
    // Update cost breakdown with L5 costs
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
      // If there are no more items, stay on this page but show a message
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
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Quotation Cost Formula</CardTitle>
            <CardDescription>L5 = L4 × (1 + Profit Margin % + Negotiation %) + Freight per kg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Input Parameters</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Should Cost (L4):</div>
                    <div>{formatINR(existingBreakdown.l4CostPerKg || 0)} per kg</div>
                    
                    <div className="text-sm font-medium">Profit Margin:</div>
                    <div>{humanIntervention.profitMarginPercentage}%</div>
                    
                    <div className="text-sm font-medium">Negotiation Margin:</div>
                    <div>{humanIntervention.negotiationPercentage}%</div>
                    
                    <div className="text-sm font-medium">Freight per kg:</div>
                    <div>{formatINR(humanIntervention.freightPerKg)}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-blue-800">Quotation Results</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Quotation Cost per kg</p>
                    <p className="text-2xl font-bold text-blue-800">{formatINR(l5Costs.l5CostPerKg)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Quotation Cost per piece</p>
                    <p className="text-2xl font-bold text-blue-800">{formatINR(l5Costs.l5CostPerPiece)}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-500">Total Quotation Cost ({currentItem?.quantity} pieces)</p>
                    <p className="text-3xl font-bold text-blue-800">{formatINR(l5Costs.totalQuotationCost)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
            <CardDescription>Complete Cost Breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Level</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Kg</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Piece</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">L1 (Material)</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l1CostPerKg || 0)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l1CostPerPiece || 0)}</td>
                    <td className="px-4 py-2">Raw material cost with waste and firm price adjustments</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">L2 (Manufacturing)</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l2CostPerKg || 0)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l2CostPerPiece || 0)}</td>
                    <td className="px-4 py-2">Processing, overheads, and related costs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">L3 (Production)</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l3CostPerKg || 0)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l3CostPerPiece || 0)}</td>
                    <td className="px-4 py-2">Total production cost (L1 + L2)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">L4 (Should Cost)</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l4CostPerKg || 0)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l4CostPerPiece || 0)}</td>
                    <td className="px-4 py-2">Production cost with commercial overheads</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 whitespace-nowrap font-medium">L5 (Quotation)</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{formatINR(l5Costs.l5CostPerKg)}</td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{formatINR(l5Costs.l5CostPerPiece)}</td>
                    <td className="px-4 py-2">Final quotation price with profit and freight</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Total Quotation Cost for {currentItem?.quantity} pieces: <span className="font-bold">{formatINR(l5Costs.totalQuotationCost)}</span>
            </p>
          </CardFooter>
        </Card>
        
        <div className="flex flex-wrap justify-between gap-4">
          <div className="space-x-2">
            <Button 
              onClick={handleStartNew}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Start New Estimation
            </Button>
            
            <Button 
              onClick={handleGoToBOM}
              variant="outline"
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Edit Items in BOM
            </Button>
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={handleNextItem}
              disabled={currentItemIndex >= materialItems.length - 1}
              className="flex items-center"
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              Estimate Next Item
            </Button>
            
            <Button 
              onClick={handleDownload}
              className="flex items-center"
              variant="secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel Report
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuotationCost;
