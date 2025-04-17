
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    contractValue,
    setContractValue
  } = useCostEstimation();

  // Calculate total quoted value from cost breakdowns
  const quotedValue = costBreakdowns.reduce((total, cost, index) => {
    const item = materialItems[index];
    if (cost && cost.l5CostPerPiece && item) {
      return total + (cost.l5CostPerPiece * item.quantity);
    }
    return total;
  }, 0);

  // State for editable values
  const [editableValues, setEditableValues] = useState({
    contractValue: contractValue,
    targetCostPercentage: 88
  });

  // Calculate allocation percentage
  const allocationPercentage = quotedValue > 0 ? (editableValues.contractValue / quotedValue) * 100 : 0;

  useEffect(() => {
    // Update contract value in context when it changes
    setContractValue(editableValues.contractValue);
  }, [editableValues.contractValue, setContractValue]);

  const handleInputChange = (field: keyof typeof editableValues, value: number) => {
    setEditableValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
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
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Target Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-center bg-[#F8D49A]">Item Cost</TableHead>
                    <TableHead className="text-center bg-[#F8D49A]">Freight Cost</TableHead>
                    <TableHead className="text-center bg-[#F8D49A]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-blue-800">Contract Value</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={editableValues.contractValue}
                        onChange={(e) => handleInputChange('contractValue', Number(e.target.value))}
                        className="max-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>{formatINR(humanIntervention.freightPerKg)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-blue-800">Quoted Value</TableCell>
                    <TableCell>{formatINR(quotedValue)}</TableCell>
                    <TableCell>{formatINR(humanIntervention.freightPerKg)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-blue-800">Allocation %</TableCell>
                    <TableCell>{allocationPercentage.toFixed(2)}%</TableCell>
                    <TableCell className="font-medium text-blue-800">Target cost %</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={editableValues.targetCostPercentage}
                        onChange={(e) => handleInputChange('targetCostPercentage', Number(e.target.value))}
                        className="max-w-[100px]"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle>Target Cost Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={7} className="text-center bg-[#F2FCE2]">Quoted Cost</TableHead>
                    <TableHead colSpan={5} className="text-center bg-[#D3E4FD]">Target Cost</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-[#F2FCE2]/80">Item No.</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Item Description</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Item Spec</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Wt pr pc</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Rate per kg</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Rate per pc</TableHead>
                    <TableHead className="bg-[#F2FCE2]/80">Quoted Qty</TableHead>
                    
                    <TableHead className="bg-[#D3E4FD]/80">Target Rate per kg</TableHead>
                    <TableHead className="bg-[#D3E4FD]/80">Target Rate per PC</TableHead>
                    <TableHead className="bg-[#D3E4FD]/80">Ordered Qty</TableHead>
                    <TableHead className="bg-[#D3E4FD]/80">Target L1 cost</TableHead>
                    <TableHead className="bg-[#D3E4FD]/80">Profit Envisaged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {targetCostItems.map((item, index) => {
                    // Recalculate target values based on editable target cost percentage
                    const targetRatePerKg = item.ratePerKg * (editableValues.targetCostPercentage / 100);
                    const targetRatePerPiece = targetRatePerKg * item.weightPerPiece;
                    const targetL1Cost = targetRatePerPiece * item.orderedQty;
                    
                    // Find corresponding cost breakdown for L3 cost
                    const costBreakdown = costBreakdowns[index];
                    const l3CostPerKg = costBreakdown?.l3CostPerKg || 0;
                    
                    // Calculate Target L5 costs
                    const targetL5CostPerKg = (targetRatePerKg + l3CostPerKg) + 
                                             (targetRatePerKg + l3CostPerKg) * (humanIntervention.profitMarginPercentage / 100);
                    const targetL5CostPerPiece = targetL5CostPerKg * item.weightPerPiece;
                    const totalTargetL5Cost = targetL5CostPerPiece * item.orderedQty;
                    
                    // Calculate final quoted cost from cost breakdown
                    const finalQuotedCost = (costBreakdown?.l5CostPerPiece || 0) * item.quotedQty;
                    
                    // Calculate profit envisaged
                    const profitEnvisaged = finalQuotedCost > 0 ? 
                                           (finalQuotedCost - totalTargetL5Cost) / finalQuotedCost : 0;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="bg-[#F2FCE2]/30">{item.itemNumber}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">{item.itemDescription}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">{item.itemSpec}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">{item.weightPerPiece.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">₹{item.ratePerKg.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">₹{item.ratePerPiece.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#F2FCE2]/30">{item.quotedQty}</TableCell>
                        
                        <TableCell className="bg-[#D3E4FD]/30">₹{targetRatePerKg.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#D3E4FD]/30">₹{targetRatePerPiece.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#D3E4FD]/30">{item.orderedQty}</TableCell>
                        <TableCell className="bg-[#D3E4FD]/30">₹{targetL1Cost.toFixed(2)}</TableCell>
                        <TableCell className="bg-[#D3E4FD]/30">{(profitEnvisaged * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    );
                  })}
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
