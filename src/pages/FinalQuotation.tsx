
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ChevronRight } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { format } from "date-fns";
import { calculateFreightCost } from "@/utils/calculations";
import { toast } from "@/components/ui/use-toast";

const FinalQuotation = () => {
  const navigate = useNavigate();
  const { 
    projectDetails, 
    materialItems, 
    costBreakdowns,
    humanIntervention,
    setCurrentItemIndex,
    currentItemIndex,
    targetCostItems,
    setTargetCostItems
  } = useCostEstimation();

  const totalQuantity = materialItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = materialItems.reduce((sum, item) => sum + item.totalWeight, 0);

  const handleDownload = () => {
    exportToExcel(materialItems, costBreakdowns, humanIntervention);
  };

  const handleStartNew = () => {
    // Navigate to home page to restart the flow
    navigate("/");
  };

  const handleNextItem = () => {
    if (materialItems.length <= 1) {
      toast({
        title: "Estimation Complete",
        description: "Estimation done for the given item.",
        variant: "default",
      });
      return;
    }
    
    // If there are more items in the BOM
    if (currentItemIndex < materialItems.length - 1) {
      // Move to next item
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      // Reset to the first item if we've gone through all items
      setCurrentItemIndex(0);
    }
    
    // Go to Bill of Materials page
    navigate("/bill-of-materials");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Final Quotation" 
      previousPage="/quotation-cost"
      showNavigation={false}
    >
      <Navigation />
      
      <div className="space-y-6 bg-[#F2FCE2] p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Customer Name:</div>
                <div>{projectDetails.customerName}</div>
                
                <div className="text-sm font-medium">Customer ID:</div>
                <div>{projectDetails.customerId}</div>
                
                <div className="text-sm font-medium">Project Name:</div>
                <div>{projectDetails.projectName}</div>
                
                <div className="text-sm font-medium">Project ID:</div>
                <div>{projectDetails.projectId}</div>
                
                <div className="text-sm font-medium">Location:</div>
                <div>{projectDetails.location}</div>
                
                <div className="text-sm font-medium">Firm Price:</div>
                <div>{projectDetails.firmPrice ? "Yes" : "No"}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Estimation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Total Items:</div>
                <div>{materialItems.length}</div>
                
                <div className="text-sm font-medium">Estimation Date:</div>
                <div>{format(new Date(), "dd/MM/yyyy")}</div>
                
                <div className="text-sm font-medium">Total Quantity:</div>
                <div>{totalQuantity} pieces</div>
                
                <div className="text-sm font-medium">Total Weight:</div>
                <div>{totalWeight.toFixed(2)} kg</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F2FCE2]">
                    <TableHead>S.No</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quoted-L1 Cost/kg</TableHead>
                    <TableHead>Quoted-L2 Cost/kg</TableHead>
                    <TableHead>Quoted-L3 Cost/kg</TableHead>
                    <TableHead>Quoted-L4 Cost/kg</TableHead>
                    <TableHead>Quoted-L5 Cost/kg</TableHead>
                    <TableHead>Total Quoted-Cost/piece</TableHead>
                    <TableHead>Final-Quoted-Cost Freight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialItems.map((item, index) => {
                    const cost = costBreakdowns[index];
                    const freightCost = calculateFreightCost(item.unitWeight, humanIntervention.freightPerKg);
                    
                    // Generate target cost items for each material item
                    if (!targetCostItems[index] && cost) {
                      const targetCostPercentage = 88; // 88% as specified
                      const targetRatePerKg = (cost.l1CostPerKg * targetCostPercentage) / 100;
                      const targetRatePerPiece = targetRatePerKg * item.unitWeight;
                      const targetL1Cost = targetRatePerPiece * item.quantity;
                      const targetL5CostPerKg = cost.l3CostPerKg 
                        ? (targetRatePerKg + cost.l3CostPerKg) + (targetRatePerKg + cost.l3CostPerKg) * (humanIntervention.profitMarginPercentage / 100)
                        : 0;
                      const targetL5CostPerPiece = targetL5CostPerKg * item.unitWeight;
                      const totalTargetL5Cost = targetL5CostPerPiece * item.quantity;
                      const finalQuotedCost = (cost.l5CostPerPiece || 0) * item.quantity;
                      const profitEnvisaged = finalQuotedCost > 0 ? (finalQuotedCost - totalTargetL5Cost) / finalQuotedCost : 0;

                      const newTargetItem = {
                        itemNumber: item.itemPartNumber,
                        itemDescription: item.itemDescription,
                        itemSpec: item.material || "",
                        weightPerPiece: item.unitWeight,
                        ratePerKg: cost.l1CostPerKg,
                        ratePerPiece: cost.l1CostPerPiece,
                        quotedQty: item.quantity,
                        quotedL1Cost: cost.l1CostPerKg * item.quantity,
                        targetRatePerKg,
                        targetRatePerPiece,
                        orderedQty: item.quantity,
                        targetL1Cost,
                        targetL5CostPerKg,
                        targetL5CostPerPiece,
                        totalTargetL5Cost,
                        profitEnvisaged
                      };

                      // Add to target cost items
                      const updatedTargetItems = [...targetCostItems];
                      updatedTargetItems[index] = newTargetItem;
                      setTargetCostItems(updatedTargetItems);
                    }
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.itemPartNumber}</TableCell>
                        <TableCell>{item.itemDescription}</TableCell>
                        <TableCell>{item.unitWeight}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{cost?.l1CostPerKg?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{cost?.l2CostPerKg?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{cost?.l3CostPerKg?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{cost?.l4CostPerKg?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{cost?.l5CostPerKg?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{cost?.l5CostPerPiece?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>₹{freightCost.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <div className="space-x-4">
            <Button onClick={handleStartNew} variant="outline" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Final Quote Estimate
            </Button>
            <Button onClick={handleNextItem} variant="outline" className="flex items-center">
              <ChevronRight className="mr-2 h-4 w-4" />
              Next Item in BOM
            </Button>
          </div>
          <Button onClick={handleDownload} className="flex items-center bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="mr-2 h-4 w-4" />
            Download Excel Report
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default FinalQuotation;
