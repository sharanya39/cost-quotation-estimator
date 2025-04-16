
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/utils/calculations";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';

const TargetCostEstimation = () => {
  const navigate = useNavigate();
  const { 
    projectDetails, 
    materialItems, 
    costBreakdowns,
    targetCostItems,
    humanIntervention,
    contractValue
  } = useCostEstimation();

  // Calculate total quoted value from cost breakdowns
  const quotedValue = costBreakdowns.reduce((total, cost, index) => {
    const item = materialItems[index];
    if (cost && cost.l5CostPerPiece && item) {
      return total + (cost.l5CostPerPiece * item.quantity);
    }
    return total;
  }, 0);

  // Calculate allocation percentage
  const allocationPercentage = quotedValue > 0 ? (contractValue / quotedValue) * 100 : 0;
  
  const handleDownloadExcel = () => {
    // Create data for Excel export
    const exportData = targetCostItems.map((item) => ({
      'Item No': item.itemNumber,
      'Item Description': item.itemDescription,
      'Item Spec': item.itemSpec,
      'Weight per piece': item.weightPerPiece,
      'Rate per kg': item.ratePerKg,
      'Rate per piece': item.ratePerPiece,
      'Quoted Qty': item.quotedQty,
      'Quoted L1 Cost': item.quotedL1Cost,
      'Target Rate per kg': item.targetRatePerKg,
      'Target Rate per PC': item.targetRatePerPiece,
      'Ordered Qty': item.orderedQty,
      'Target L1 Cost': item.targetL1Cost,
      'Profit Envisaged': item.profitEnvisaged ? (item.profitEnvisaged * 100).toFixed(2) + '%' : '0.00%'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Target Cost Estimation");
    XLSX.writeFile(workbook, "target_cost_estimation.xlsx");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Target Cost" 
      previousPage="/project-details"
      showNavigation={false}
    >
      <Navigation />
      
      <div className="space-y-6 bg-[#F2FCE2] p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Contract & Quoted Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Contract Value:</div>
                <div>{formatINR(contractValue)}</div>
                
                <div className="text-sm font-medium">Quoted Value:</div>
                <div>{formatINR(quotedValue)}</div>
                
                <div className="text-sm font-medium">Allocation %:</div>
                <div>{allocationPercentage.toFixed(2)}%</div>
                
                <div className="text-sm font-medium">Target Cost %:</div>
                <div>88%</div>

                <div className="text-sm font-medium">Freight Cost:</div>
                <div>{formatINR(humanIntervention.freightPerKg)} per kg</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Customer Name:</div>
                <div>{projectDetails.customerName}</div>
                
                <div className="text-sm font-medium">Project Name:</div>
                <div>{projectDetails.projectName}</div>
                
                <div className="text-sm font-medium">Total Items:</div>
                <div>{materialItems.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle>Target Cost Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={4}></TableHead>
                    <TableHead colSpan={4} className="text-center bg-[#F2FCE2]">Quoted Cost</TableHead>
                    <TableHead colSpan={4} className="text-center bg-[#D3E4FD]">Target Cost</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-gray-100">Item No.</TableHead>
                    <TableHead className="bg-gray-100">Item Description</TableHead>
                    <TableHead className="bg-gray-100">Item Spec</TableHead>
                    <TableHead className="bg-gray-100">Wt pr pc</TableHead>
                    
                    <TableHead className="bg-[#F2FCE2]">Rate per kg</TableHead>
                    <TableHead className="bg-[#F2FCE2]">Rate per pc</TableHead>
                    <TableHead className="bg-[#F2FCE2]">Quoted Qty</TableHead>
                    <TableHead className="bg-[#F2FCE2]">Quoted L1 cost</TableHead>
                    
                    <TableHead className="bg-[#D3E4FD]">Target Rate per kg</TableHead>
                    <TableHead className="bg-[#D3E4FD]">Target Rate per PC</TableHead>
                    <TableHead className="bg-[#D3E4FD]">Ordered Qty</TableHead>
                    <TableHead className="bg-[#D3E4FD]">Target L1 cost</TableHead>
                    <TableHead className="bg-[#D3E4FD]">Profit Envisaged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {targetCostItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemNumber}</TableCell>
                      <TableCell>{item.itemDescription}</TableCell>
                      <TableCell>{item.itemSpec}</TableCell>
                      <TableCell>{item.weightPerPiece.toFixed(2)}</TableCell>
                      
                      <TableCell className="bg-[#F2FCE2]/50">₹{item.ratePerKg.toFixed(2)}</TableCell>
                      <TableCell className="bg-[#F2FCE2]/50">₹{item.ratePerPiece.toFixed(2)}</TableCell>
                      <TableCell className="bg-[#F2FCE2]/50">{item.quotedQty}</TableCell>
                      <TableCell className="bg-[#F2FCE2]/50">₹{item.quotedL1Cost.toFixed(2)}</TableCell>
                      
                      <TableCell className="bg-[#D3E4FD]/50">₹{item.targetRatePerKg.toFixed(2)}</TableCell>
                      <TableCell className="bg-[#D3E4FD]/50">₹{item.targetRatePerPiece.toFixed(2)}</TableCell>
                      <TableCell className="bg-[#D3E4FD]/50">{item.orderedQty}</TableCell>
                      <TableCell className="bg-[#D3E4FD]/50">₹{item.targetL1Cost.toFixed(2)}</TableCell>
                      <TableCell className="bg-[#D3E4FD]/50">{item.profitEnvisaged ? (item.profitEnvisaged * 100).toFixed(2) : '0.00'}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={handleDownloadExcel} className="flex items-center bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="mr-2 h-4 w-4" />
            Download Excel Report
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TargetCostEstimation;
