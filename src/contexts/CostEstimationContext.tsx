import { createContext, useContext, useState, ReactNode } from "react";

// Define types for our data
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

interface CostEstimationContextType {
  accessLevel: "basic" | "premium";
  setAccessLevel: (level: "basic" | "premium") => void;
  
  projectDetails: ProjectDetails;
  setProjectDetails: (details: ProjectDetails) => void;
  
  materialItems: MaterialItem[];
  setMaterialItems: (items: MaterialItem[]) => void;
  addMaterialItem: (item: MaterialItem) => void;
  
  currentItemIndex: number;
  setCurrentItemIndex: (index: number) => void;
  
  humanIntervention: HumanIntervention;
  setHumanIntervention: (intervention: HumanIntervention) => void;
  
  engineeringDetails: EngineeringDetails[];
  setEngineeringDetails: (details: EngineeringDetails[]) => void;
  addEngineeringDetail: (detail: EngineeringDetails) => void;
  
  manufacturingProcesses: ManufacturingProcess[];
  setManufacturingProcesses: (processes: ManufacturingProcess[]) => void;
  addManufacturingProcess: (process: ManufacturingProcess) => void;
  
  costBreakdowns: CostBreakdown[];
  setCostBreakdowns: (breakdowns: CostBreakdown[]) => void;
  addCostBreakdown: (breakdown: CostBreakdown) => void;
  getCurrentCostBreakdown: () => CostBreakdown | undefined;
}

// Reference tables
export const materialTable = [
  { 
    partNumber: "3011",
    title: "Hydraulic cylinder spacer",
    drawingNumber: "DWG 3494",
    material: "Stainless Steel 316",
    priceRange: "₹320 – ₹390",
    itemWeight: 0.8
  },
  { 
    partNumber: "3012",
    title: "Brake",
    drawingNumber: "DWG 5632",
    material: "Aluminum 7075-T6",
    priceRange: "₹235 – ₹670",
    itemWeight: 0.5
  },
  { 
    partNumber: "3013",
    title: "Precision component",
    drawingNumber: "DWG 1324",
    material: "Stainless Steel 304",
    priceRange: "₹250 – ₹320",
    itemWeight: 1
  }
];

export const engineeringTable = [
  {
    title: "Hydraulic cylinder spacer",
    drawingNumber: "DWG 3494",
    length: 130,
    width: 100,
    thickness: 10,
    holesSizesAndPosition: "2 holes, Ø10 @ 30mm apart",
    tolerances: "±0.1 mm",
    scaleAndRevision: "1:1",
    authors: "John D., Priya K., Ramesh S."
  },
  {
    title: "Brake",
    drawingNumber: "DWG 5632",
    length: 150,
    width: 120,
    thickness: 12,
    holesSizesAndPosition: "4 holes, Ø12 @ corners (PDC)",
    tolerances: "±0.05 mm",
    scaleAndRevision: "1:2",
    authors: "Neha M., Arjun T., Sunil K."
  },
  {
    title: "Precision component",
    drawingNumber: "DWG 1324",
    length: 80,
    width: 60,
    thickness: 15,
    holesSizesAndPosition: "3 holes, Ø8 & countersunk",
    tolerances: "±0.01 mm",
    scaleAndRevision: "2:1",
    authors: "Karthik R., Meena P."
  }
];

// Create the context with a default value
const CostEstimationContext = createContext<CostEstimationContextType | undefined>(undefined);

// Provider component
export const CostEstimationProvider = ({ children }: { children: ReactNode }) => {
  const [accessLevel, setAccessLevel] = useState<"basic" | "premium">("basic");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    customerName: "",
    customerId: "",
    projectName: "",
    projectId: "",
    location: "",
    firmPrice: false
  });
  
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  
  const [humanIntervention, setHumanIntervention] = useState<HumanIntervention>({
    firmPricePercentage: 10,
    overheadPercentage: 12,
    wastePercentage: 5,
    commercialOverheadPercentage: 10,
    profitMarginPercentage: 15,
    negotiationPercentage: 5,
    freightPerKg: 50
  });
  
  const [engineeringDetails, setEngineeringDetails] = useState<EngineeringDetails[]>([]);
  const [manufacturingProcesses, setManufacturingProcesses] = useState<ManufacturingProcess[]>([]);
  const [costBreakdowns, setCostBreakdowns] = useState<CostBreakdown[]>([]);

  const addMaterialItem = (item: MaterialItem) => {
    setMaterialItems(prev => [...prev, item]);
  };

  const addEngineeringDetail = (detail: EngineeringDetails) => {
    setEngineeringDetails(prev => [...prev, detail]);
  };

  const addManufacturingProcess = (process: ManufacturingProcess) => {
    setManufacturingProcesses(prev => [...prev, process]);
  };

  const addCostBreakdown = (breakdown: CostBreakdown) => {
    setCostBreakdowns(prev => [...prev, breakdown]);
  };

  const getCurrentCostBreakdown = () => {
    return costBreakdowns[currentItemIndex];
  };

  const value = {
    accessLevel,
    setAccessLevel,
    projectDetails,
    setProjectDetails,
    materialItems,
    setMaterialItems,
    addMaterialItem,
    currentItemIndex,
    setCurrentItemIndex,
    humanIntervention,
    setHumanIntervention,
    engineeringDetails,
    setEngineeringDetails,
    addEngineeringDetail,
    manufacturingProcesses,
    setManufacturingProcesses,
    addManufacturingProcess,
    costBreakdowns,
    setCostBreakdowns,
    addCostBreakdown,
    getCurrentCostBreakdown
  };

  return (
    <CostEstimationContext.Provider value={value}>
      {children}
    </CostEstimationContext.Provider>
  );
};

// Custom hook to use the context
export const useCostEstimation = () => {
  const context = useContext(CostEstimationContext);
  if (context === undefined) {
    throw new Error("useCostEstimation must be used within a CostEstimationProvider");
  }
  return context;
};
