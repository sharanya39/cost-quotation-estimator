
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { formatINR } from "@/utils/calculations";
import { Copy } from "lucide-react";

const CopyToClipboardButton = () => {
  const { toast } = useToast();
  const {
    projectDetails,
    materialItems,
    humanIntervention,
    engineeringDetails,
    manufacturingProcesses,
    costBreakdowns,
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

  const handleCopyToClipboard = () => {
    const quotationDetails = `
      Project Details:
        Customer Name: ${projectDetails.customerName}
        Project Name: ${projectDetails.projectName}
        Project ID: ${projectDetails.projectId}
        Location: ${projectDetails.location}

      Material Items:
        ${materialItems.map((item, index) => {
          const costBreakdown = costBreakdowns[index];
          return `
            Item ${index + 1}:
              Item Part Number: ${item.itemPartNumber}
              Item Description: ${item.itemDescription}
              Quantity: ${item.quantity}
              L5 Cost Per Piece: ${formatINR(costBreakdown?.l5CostPerPiece || 0)}
          `;
        }).join('\n')}

      Human Intervention Parameters:
        Firm Price Percentage: ${humanIntervention.firmPricePercentage}%
        Overhead Percentage: ${humanIntervention.overheadPercentage}%
        Waste Percentage: ${humanIntervention.wastePercentage}%
        Commercial Overhead Percentage: ${humanIntervention.commercialOverheadPercentage}%
        Profit Margin Percentage: ${humanIntervention.profitMarginPercentage}%
        Negotiation Percentage: ${humanIntervention.negotiationPercentage}%
        Freight Per Kg: ${formatINR(humanIntervention.freightPerKg)}

      Engineering Details:
        ${engineeringDetails.map((detail) => `
            Title: ${detail.title}
            Drawing Number: ${detail.drawingNumber}
            Length: ${detail.length}
            Width: ${detail.width}
            Thickness: ${detail.thickness}
            Holes Sizes and Position: ${detail.holesSizesAndPosition}
            Tolerances: ${detail.tolerances}
            Scale and Revision: ${detail.scaleAndRevision}
            Authors: ${detail.authors}
        `).join('\n')}

      Manufacturing Processes:
        ${manufacturingProcesses.map((process, index) => {
          const costBreakdown = costBreakdowns[index];
          return `
            Process ${index + 1}:
              Process: ${process.process}
              Setup Time Per Batch: ${process.setupTimePerBatch}
              Batch Quantity: ${process.batchQuantity}
              Setup Time Per Piece: ${process.setupTimePerPiece}
              Cycle Time Per Piece: ${process.cycleTimePerPiece}
              Machine Hour Rate: ${formatINR(process.machineHourRate)}
              Setup Cost: ${formatINR(process.setupCost)}
              Cycle Cost: ${formatINR(process.cycleCost)}
              L5 Cost Per Piece: ${formatINR(costBreakdown?.l5CostPerPiece || 0)}
          `;
        }).join('\n')}

      Cost Breakdown:
        Total Material Cost: ${formatINR(totalMaterialCost)}
        Total Manufacturing Cost: ${formatINR(totalManufacturingCost)}
        Final Quoted Cost: ${formatINR(finalQuotedCost)}

      Target Cost Items:
        ${targetCostItems.map((item) => `
            Item Number: ${item.itemNumber}
            Item Description: ${item.itemDescription}
            Item Spec: ${item.itemSpec}
            Weight Per Piece: ${item.weightPerPiece}
            Rate Per Kg: ${formatINR(item.ratePerKg)}
            Rate Per Piece: ${formatINR(item.ratePerPiece)}
            Quoted Qty: ${item.quotedQty}
            Quoted L1 Cost: ${formatINR(item.quotedL1Cost)}
            Target Rate Per Kg: ${formatINR(item.targetRatePerKg)}
            Target Rate Per Piece: ${formatINR(item.targetRatePerPiece)}
            Ordered Qty: ${item.orderedQty}
            Target L1 Cost: ${formatINR(item.targetL1Cost)}
            Target L5 Cost Per Kg: ${formatINR(item.targetL5CostPerKg || 0)}
            Target L5 Cost Per Piece: ${formatINR(item.targetL5CostPerPiece || 0)}
            Total Target L5 Cost: ${formatINR(item.totalTargetL5Cost || 0)}
            Profit Envisaged: ${(item.profitEnvisaged || 0).toFixed(2)}%
        `).join('\n')}

      Contract Value: ${formatINR(contractValue)}
      Total Target L5 Cost: ${formatINR(totalTargetL5Cost)}
      Profit Envisaged: ${(profitEnvisaged * 100).toFixed(2)}%
    `;

    navigator.clipboard.writeText(quotationDetails)
      .then(() => {
        toast({
          title: "Quotation details copied to clipboard!",
          description: "You can now paste the quotation details into an email or document.",
        });
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Failed to copy quotation details to clipboard!",
          description: "Please try again.",
        });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Button onClick={handleCopyToClipboard} className="mt-6">
      <Copy className="mr-2" size={16} />
      Copy Quotation Details to Clipboard
    </Button>
  );
};

export default CopyToClipboardButton;
