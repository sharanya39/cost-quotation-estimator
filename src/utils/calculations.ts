// Calculate setup time per piece
export const calculateSetupTimePerPiece = (setupTimePerBatch: number, batchQuantity: number): number => {
  return setupTimePerBatch / batchQuantity;
};

// Calculate setup cost
export const calculateSetupCost = (setupTimePerPiece: number, machineHourRate: number): number => {
  return (setupTimePerPiece * (machineHourRate / 60));
};

// Calculate cycle cost
export const calculateCycleCost = (cycleTimePerPiece: number, machineHourRate: number): number => {
  return (cycleTimePerPiece * (machineHourRate / 60));
};

// Calculate total manufacturing cost
export const calculateBaseManufacturingCost = (
  setupCost: number,
  cycleCost: number,
  overheadPercentage: number,
  paintingCost: number,
  inspectionCost: number,
  packagingCost: number
): number => {
  return (setupCost + cycleCost) * (1 + overheadPercentage / 100) + paintingCost + inspectionCost + packagingCost;
};

// Calculate L1 cost (Material)
export const calculateL1Cost = (
  partWeight: number,
  wastePercentage: number,
  materialPrice: number,
  firmPricePercentage: number
): number => {
  return partWeight * (1 + wastePercentage / 100) * materialPrice * (1 + firmPricePercentage / 100);
};

// Calculate L3 cost (Production)
export const calculateL3Cost = (l1Cost: number, l2Cost: number): number => {
  return l1Cost + l2Cost;
};

// Calculate L4 cost (Should Cost)
export const calculateL4Cost = (l3Cost: number, commercialOverheadPercentage: number): number => {
  return l3Cost * (1 + commercialOverheadPercentage / 100);
};

// Calculate L5 cost (Quotation Cost) - Without freight
export const calculateL5Cost = (
  l4Cost: number,
  profitMarginPercentage: number,
  negotiationPercentage: number
): number => {
  return l4Cost * (1 + (profitMarginPercentage + negotiationPercentage) / 100);
};

// Separate function for freight cost
export const calculateFreightCost = (weight: number, freightPerKg: number): number => {
  return weight * freightPerKg;
};

// Calculate target rate per kg
export const calculateTargetRatePerKg = (
  ratePerKg: number,
  targetCostPercentage: number
): number => {
  return ratePerKg * (targetCostPercentage / 100);
};

// Calculate target L5 cost per kg
export const calculateTargetL5CostPerKg = (
  targetRatePerKg: number,
  quotedL3CostPerKg: number,
  profitMarginPercentage: number
): number => {
  return (targetRatePerKg + quotedL3CostPerKg) + 
         (targetRatePerKg + quotedL3CostPerKg) * (profitMarginPercentage / 100);
};

// Calculate profit envisaged
export const calculateProfitEnvisaged = (
  finalQuotedCost: number,
  totalTargetL5Cost: number
): number => {
  return (finalQuotedCost - totalTargetL5Cost) / finalQuotedCost;
};

// Extract median price from price range string
export const extractMedianPrice = (priceRange: string): number => {
  // Check if the price is already a single number
  if (priceRange.match(/^₹\d+$/)) {
    return parseInt(priceRange.replace('₹', ''));
  }
  
  // Example: "₹320 – ₹390"
  const prices = priceRange.match(/₹(\d+)/g);
  if (!prices || prices.length < 2) return 0;
  
  const min = parseInt(prices[0].replace('₹', ''));
  const max = parseInt(prices[1].replace('₹', ''));
  
  return (min + max) / 2;
};

// Format currency to INR
export const formatINR = (value: number): string => {
  return `₹${value.toFixed(2)}`;
};
