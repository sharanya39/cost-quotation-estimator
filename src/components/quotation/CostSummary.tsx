
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { formatINR } from "@/utils/calculations";

const CostSummary = () => {
  const {
    materialItems,
    costBreakdowns,
    manufacturingProcesses,
    targetCostItems,
    contractValue
  } = useCostEstimation();

  // Calculate total material cost
  const totalMaterialCost = materialItems.reduce((sum, item) => {
    const costBreakdown = costBreakdowns.find((cb) => materialItems.indexOf(item) === costBreakdowns.indexOf(cb));
    return sum + (costBreakdown?.l5CostPerPiece || 0);
  }, 0);

  // Calculate total manufacturing cost
  const totalManufacturingCost = manufacturingProcesses.reduce((sum, process) => {
    const itemIndex = manufacturingProcesses.indexOf(process);
    const costBreakdown = costBreakdowns[itemIndex];
    return sum + (costBreakdown?.l5CostPerPiece || 0);
  }, 0);

  // Calculate total target L5 cost
  const totalTargetL5Cost = targetCostItems.reduce((sum, item) => {
    return sum + (item.totalTargetL5Cost || 0);
  }, 0);

  // Calculate final quoted cost
  const finalQuotedCost = totalMaterialCost + totalManufacturingCost;

  // Calculate profit envisaged
  const profitEnvisaged = (finalQuotedCost - totalTargetL5Cost) / finalQuotedCost;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Cost Summary</h3>
      <div className="space-y-2">
        <p>Total Material Cost: {formatINR(totalMaterialCost)}</p>
        <p>Total Manufacturing Cost: {formatINR(totalManufacturingCost)}</p>
        <p>Final Quoted Cost: {formatINR(finalQuotedCost)}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-4">Target Cost Analysis</h3>
      <div className="space-y-2">
        <p>Contract Value: {formatINR(contractValue)}</p>
        <p>Total Target L5 Cost: {formatINR(totalTargetL5Cost)}</p>
        <p>Profit Envisaged: {(profitEnvisaged * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default CostSummary;
