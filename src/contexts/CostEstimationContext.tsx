
import { createContext, useContext, useState, ReactNode } from "react";
import { CostEstimationContextType } from "./CostEstimationContextType";
import {
  ProjectDetails,
  MaterialItem,
  HumanIntervention,
  EngineeringDetails,
  ManufacturingProcess,
  CostBreakdown
} from "../types/cost-estimation";
import { materialTable, engineeringTable } from "../data/reference-data";

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

  const value: CostEstimationContextType = {
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

// Export reference data
export { materialTable, engineeringTable };
export type { CostEstimationContextType };
