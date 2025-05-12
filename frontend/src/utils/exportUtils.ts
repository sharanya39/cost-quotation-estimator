
import * as XLSX from 'xlsx';
import { MaterialItem, CostBreakdown, HumanIntervention } from '../types/cost-estimation';
import { formatINR } from './calculations';

interface FinalEstimationItem {
  slNo: number;
  itemNumber: string;
  itemDescription: string;
  materialGrade: string;
  weightPerPiece: number;
  ratePerKg: number;
  ratePerPiece: number;
  quotedQty: number;
  quotedL1Cost: number;
  quotedL2CostPerKg: number;
  quotedL3CostPerKg: number;
  quotedL4CostPerKg: number;
  quotedL5CostPerKg: number;
  totalQuotedCostPerPiece: number;
  finalQuotedCost: number;
  freightCost: number;
}

export const exportToExcel = (materialItems: MaterialItem[], costBreakdowns: CostBreakdown[], humanIntervention: HumanIntervention) => {
  const exportData: FinalEstimationItem[] = materialItems.map((item, index) => {
    const cost = costBreakdowns[index] || {
      l1CostPerKg: 0,
      l1CostPerPiece: 0,
      l2CostPerKg: 0,
      l3CostPerKg: 0,
      l4CostPerKg: 0,
      l5CostPerKg: 0,
      l5CostPerPiece: 0,
    };
    
    const freightCost = humanIntervention.freightPerKg || 50;
    
    return {
      slNo: index + 1,
      itemNumber: item.itemPartNumber,
      itemDescription: item.itemDescription,
      materialGrade: item.material || 'Standard',
      weightPerPiece: item.unitWeight,
      ratePerKg: cost.l1CostPerKg || 0,
      ratePerPiece: cost.l1CostPerPiece || 0,
      quotedQty: item.quantity,
      quotedL1Cost: (cost.l1CostPerPiece || 0) * item.quantity,
      quotedL2CostPerKg: cost.l2CostPerKg || 0,
      quotedL3CostPerKg: cost.l3CostPerKg || 0,
      quotedL4CostPerKg: cost.l4CostPerKg || 0,
      quotedL5CostPerKg: cost.l5CostPerKg || 0,
      totalQuotedCostPerPiece: cost.l5CostPerPiece || 0,
      finalQuotedCost: (cost.l5CostPerPiece || 0) * item.quantity,
      freightCost
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const headers = [
    "Sl.No",
    "Item No.",
    "Item Description",
    "Material Grade",
    "Wt pr pc (kg)",
    "Rate per kg",
    "Rate per pc",
    "Quoted Qty",
    "Quoted L1 cost",
    "Quoted L2 cost R/kg",
    "Quoted L3 cost R/kg",
    "Quoted L4 cost R/kg",
    "Quoted L5 cost R/kg",
    "Total quoted cost pr pc",
    "Final quoted cost",
    "Freight cost per kg"
  ];

  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cost Estimation");
  XLSX.writeFile(workbook, "cost_estimation.xlsx");
};
