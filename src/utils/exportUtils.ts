
import * as XLSX from 'xlsx';
import { MaterialItem, CostBreakdown } from '../contexts/CostEstimationContext';

interface FinalEstimationItem {
  sno: number;
  itemPartNumber: string;
  itemDescription: string;
  itemWeight: number;
  quantity: number;
  l1CostPerKg: number;
  l2CostPerKg: number;
  l3CostPerKg: number;
  l4CostPerKg: number;
  l5CostPerKg: number;
  l5CostPerPiece: number;
  totalQuotationCost: number;
}

export const exportToExcel = (materialItems: MaterialItem[], costBreakdowns: CostBreakdown[]) => {
  // Create the data for export
  const exportData: FinalEstimationItem[] = materialItems.map((item, index) => {
    const cost = costBreakdowns[index] || {
      l1CostPerKg: 0,
      l2CostPerKg: 0,
      l3CostPerKg: 0,
      l4CostPerKg: 0,
      l5CostPerKg: 0,
      l5CostPerPiece: 0,
      totalQuotationCost: 0
    };
    
    return {
      sno: index + 1,
      itemPartNumber: item.itemPartNumber,
      itemDescription: item.itemDescription,
      itemWeight: item.unitWeight,
      quantity: item.quantity,
      l1CostPerKg: cost.l1CostPerKg,
      l2CostPerKg: cost.l2CostPerKg,
      l3CostPerKg: cost.l3CostPerKg,
      l4CostPerKg: cost.l4CostPerKg,
      l5CostPerKg: cost.l5CostPerKg,
      l5CostPerPiece: cost.l5CostPerPiece,
      totalQuotationCost: cost.totalQuotationCost
    };
  });

  // Create the worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column headers
  const headers = [
    "S.No",
    "Item Part Number",
    "Item Description",
    "Item Weight (kg)",
    "Quantity",
    "Material Cost (L1) per kg in INR",
    "Mfc Cost (L2) per kg in INR",
    "Production Cost (L3=L1+L2) per kg in INR",
    "Should Cost (L4=L3*CAOH)",
    "Total Est Cost (L5=L4*profit margin+freight) per kg in INR",
    "Total Est Cost (L5) per piece in INR",
    "Total Quotation Cost in INR"
  ];

  // Add headers to the worksheet
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cost Estimation");

  // Generate the Excel file
  XLSX.writeFile(workbook, "cost_estimation.xlsx");
};
