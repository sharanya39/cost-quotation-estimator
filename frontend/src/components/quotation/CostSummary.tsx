
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { formatINR } from "@/utils/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, RefreshCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { exportToExcel } from "@/utils/exportUtils";

const CostSummary = () => {
  const navigate = useNavigate();
  const {
    materialItems,
    costBreakdowns,
    humanIntervention,
    manufacturingProcesses,
    targetCostItems,
    contractValue,
    setCurrentItemIndex
  } = useCostEstimation();

  // Calculate total material cost
  const totalMaterialCost = materialItems.reduce((sum, item, index) => {
    const costBreakdown = costBreakdowns[index];
    return sum + (costBreakdown?.l5CostPerPiece || 0) * item.quantity;
  }, 0);

  // Generate rows for the detailed table
  const tableRows = materialItems.map((item, index) => {
    const costBreakdown = costBreakdowns[index] || {
      l1CostPerKg: 0,
      l1CostPerPiece: 0,
      l2CostPerKg: 0,
      l3CostPerKg: 0,
      l4CostPerKg: 0,
      l5CostPerKg: 0,
      l5CostPerPiece: 0
    };

    const totalCostPerPiece = costBreakdown.l5CostPerPiece || 0;
    const finalQuotedCost = totalCostPerPiece * item.quantity;
    const freightCost = humanIntervention.freightPerKg;

    return {
      slNo: index + 1,
      itemNumber: item.itemNumber,
      itemDescription: item.itemDescription,
      materialGrade: item.material || 'Standard',
      weightPerPiece: item.unitWeight,
      ratePerKg: costBreakdown.l1CostPerKg || 0,
      ratePerPiece: costBreakdown.l1CostPerPiece || 0,
      quotedQty: item.quantity,
      quotedL1Cost: (costBreakdown.l1CostPerPiece || 0) * item.quantity,
      quotedL2CostPerKg: costBreakdown.l2CostPerKg || 0,
      quotedL3CostPerKg: costBreakdown.l3CostPerKg || 0,
      quotedL4CostPerKg: costBreakdown.l4CostPerKg || 0,
      quotedL5CostPerKg: costBreakdown.l5CostPerKg || 0,
      totalQuotedCostPerPiece: totalCostPerPiece,
      finalQuotedCost: finalQuotedCost,
      freightCost: freightCost
    };
  });

  const handleDownloadExcel = () => {
    exportToExcel(materialItems, costBreakdowns, humanIntervention);
  };

  const handleNewEstimation = () => {
    navigate('/project-details');
  };

  const handleNextBomItem = () => {
    if (materialItems.length > 1 && costBreakdowns.length > 0) {
      const nextIndex = (materialItems.findIndex((item, idx) => 
        !costBreakdowns[idx]) + 1) % materialItems.length;
      setCurrentItemIndex(nextIndex);
      navigate('/material-cost');
    }
  };

  const handleTargetCostEstimation = () => {
    navigate('/target-cost-estimation');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Cost Summary</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total Material Cost</TableCell>
                <TableCell>{formatINR(totalMaterialCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Manufacturing Cost</TableCell>
                <TableCell>{formatINR(manufacturingProcesses.reduce((sum, process) => {
                  return sum + 250; // Placeholder for manufacturing cost
                }, 0))}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Final Quoted Cost</TableCell>
                <TableCell className="font-bold text-primary">{formatINR(totalMaterialCost + manufacturingProcesses.reduce((sum, process) => sum + 250, 0))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Detailed Cost Breakdown</h3>
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Sl.No</TableHead>
              <TableHead className="whitespace-nowrap">Item No.</TableHead>
              <TableHead className="whitespace-nowrap">Item Description</TableHead>
              <TableHead className="whitespace-nowrap">Material Grade</TableHead>
              <TableHead className="whitespace-nowrap">Wt pr pc (kg)</TableHead>
              <TableHead className="whitespace-nowrap">Rate per kg</TableHead>
              <TableHead className="whitespace-nowrap">Rate per pc</TableHead>
              <TableHead className="whitespace-nowrap">Quoted Qty</TableHead>
              <TableHead className="whitespace-nowrap">Quoted L1 cost</TableHead>
              <TableHead className="whitespace-nowrap">Quoted L2 cost R/kg</TableHead>
              <TableHead className="whitespace-nowrap">Quoted L3 cost R/kg</TableHead>
              <TableHead className="whitespace-nowrap">Quoted L4 cost R/kg</TableHead>
              <TableHead className="whitespace-nowrap">Quoted L5 cost R/kg</TableHead>
              <TableHead className="whitespace-nowrap">Total quoted cost pr pc</TableHead>
              <TableHead className="whitespace-nowrap">Final quoted cost</TableHead>
              <TableHead className="whitespace-nowrap">Freight cost per kg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={row.slNo}>
                <TableCell>{row.slNo}</TableCell>
                <TableCell>{row.itemNumber}</TableCell>
                <TableCell>{row.itemDescription}</TableCell>
                <TableCell>{row.materialGrade}</TableCell>
                <TableCell>{row.weightPerPiece.toFixed(2)}</TableCell>
                <TableCell>{formatINR(row.ratePerKg)}</TableCell>
                <TableCell>{formatINR(row.ratePerPiece)}</TableCell>
                <TableCell>{row.quotedQty}</TableCell>
                <TableCell>{formatINR(row.quotedL1Cost)}</TableCell>
                <TableCell>{formatINR(row.quotedL2CostPerKg)}</TableCell>
                <TableCell>{formatINR(row.quotedL3CostPerKg)}</TableCell>
                <TableCell>{formatINR(row.quotedL4CostPerKg)}</TableCell>
                <TableCell>{formatINR(row.quotedL5CostPerKg)}</TableCell>
                <TableCell>{formatINR(row.totalQuotedCostPerPiece)}</TableCell>
                <TableCell>{formatINR(row.finalQuotedCost)}</TableCell>
                <TableCell>{formatINR(row.freightCost)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-4 justify-end mt-6">
        <Button onClick={handleDownloadExcel} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Excel
        </Button>
        <Button onClick={handleNewEstimation} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          New Estimation
        </Button>
        <Button onClick={handleNextBomItem} variant="outline" className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4" />
          Estimate Next in BOM
        </Button>
        <Button onClick={handleTargetCostEstimation} className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4" />
          Continue to Target Cost Estimation
        </Button>
      </div>
    </div>
  );
};

export default CostSummary;
