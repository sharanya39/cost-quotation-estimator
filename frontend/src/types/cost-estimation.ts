
export interface ProjectDetails {
  customerName: string;
  customerId: string;
  projectName: string;
  projectId: string;
  location: string;
  firmPrice: boolean;
}

export interface MaterialItem {
  itemNumber: number;
  itemPartNumber: string;
  itemDescription: string;
  unitWeight: number;
  quantity: number;
  totalWeight: number;
  material?: string;
  priceRange?: string;
}

export interface HumanIntervention {
  firmPricePercentage: number;
  overheadPercentage: number;
  wastePercentage: number;
  commercialOverheadPercentage: number;
  profitMarginPercentage: number;
  negotiationPercentage: number;
  freightPerKg: number;
}

export interface EngineeringDetails {
  title: string;
  drawingNumber: string;
  length: number;
  width: number;
  thickness: number;
  holesSizesAndPosition: string;
  tolerances: string;
  scaleAndRevision: string;
  authors: string;
  material?: string;
  surfaceTreatment?: string;
}

export interface ManufacturingProcess {
  process: string;
  setupTimePerBatch: number;
  batchQuantity: number;
  setupTimePerPiece: number;
  cycleTimePerPiece: number;
  machineHourRate: number;
  setupCost: number;
  cycleCost: number;
}

export interface CostBreakdown {
  l1CostPerKg: number;
  l1CostPerPiece: number;
  l2CostPerKg?: number;
  l2CostPerPiece?: number;
  l3CostPerKg?: number;
  l3CostPerPiece?: number;
  l4CostPerKg?: number;
  l4CostPerPiece?: number;
  l5CostPerKg?: number;
  l5CostPerPiece?: number;
  totalQuotationCost?: number;
}

export interface TargetCostItem {
  itemNumber: string;
  itemDescription: string;
  itemSpec: string;
  weightPerPiece: number;
  ratePerKg: number;
  ratePerPiece: number;
  quotedQty: number;
  quotedL1Cost: number;
  targetRatePerKg: number;
  targetRatePerPiece: number;
  orderedQty: number;
  targetL1Cost: number;
  targetL5CostPerKg?: number;
  targetL5CostPerPiece?: number;
  totalTargetL5Cost?: number;
  profitEnvisaged?: number;
}
