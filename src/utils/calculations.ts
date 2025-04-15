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

// Calculate L5 cost (Quotation Cost)
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

// Extract median price from price range string
export const extractMedianPrice = (priceRange: string): number => {
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
