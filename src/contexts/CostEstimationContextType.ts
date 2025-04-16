
import {
  ProjectDetails,
  MaterialItem,
  HumanIntervention,
  EngineeringDetails,
  ManufacturingProcess,
  CostBreakdown
} from "../types/cost-estimation";

export interface CostEstimationContextType {
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
