import * as XLSX from 'xlsx';
import { MaterialItem, CostBreakdown, HumanIntervention } from '../types/cost-estimation';
import { calculateFreightCost } from './calculations';

interface FinalEstimationItem {
  sno: number;
  partNumber: string;
  description: string;
  weight: number;
  quantity: number;
  quotedL1CostPerKg: number;
  quotedL2CostPerKg: number;
  quotedL3CostPerKg: number;
  quotedL4CostPerKg: number;
  quotedL5CostPerKg: number;
  totalQuotedCostPerPiece: number;
  finalQuotedCostFreight: number;
}

export const exportToExcel = (materialItems: MaterialItem[], costBreakdowns: CostBreakdown[], humanIntervention: HumanIntervention) => {
  const exportData: FinalEstimationItem[] = materialItems.map((item, index) => {
    const cost = costBreakdowns[index] || {
      l1CostPerKg: 0,
      l2CostPerKg: 0,
      l3CostPerKg: 0,
      l4CostPerKg: 0,
      l5CostPerKg: 0,
      l5CostPerPiece: 0,
    };
    
    const freightCost = calculateFreightCost(item.unitWeight, humanIntervention.freightPerKg);
    
    return {
      sno: index + 1,
      partNumber: item.itemPartNumber,
      description: item.itemDescription,
      weight: item.unitWeight,
      quantity: item.quantity,
      quotedL1CostPerKg: cost.l1CostPerKg || 0,
      quotedL2CostPerKg: cost.l2CostPerKg || 0,
      quotedL3CostPerKg: cost.l3CostPerKg || 0,
      quotedL4CostPerKg: cost.l4CostPerKg || 0,
      quotedL5CostPerKg: cost.l5CostPerKg || 0,
      totalQuotedCostPerPiece: cost.l5CostPerPiece || 0,
      finalQuotedCostFreight: freightCost
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const headers = [
    "S.No",
    "Part Number",
    "Description",
    "Weight (kg)",
    "Quantity",
    "Quoted-L1 Cost/kg",
    "Quoted-L2 Cost/kg",
    "Quoted-L3 Cost/kg",
    "Quoted-L4 Cost/kg",
    "Quoted-L5 Cost/kg",
    "Total Quoted-Cost/piece",
    "Final-Quoted-Cost Freight"
  ];

  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cost Estimation");
  XLSX.writeFile(workbook, "cost_estimation.xlsx");
};
