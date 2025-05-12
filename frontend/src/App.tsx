
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CostEstimationProvider } from "./contexts/CostEstimationContext";

// Pages
import LandingPage from "./pages/LandingPage";
import PlanSelection from "./pages/PlanSelection";
import ProjectDetails from "./pages/ProjectDetails";
import BillOfMaterials from "./pages/BillOfMaterials";
import HumanIntervention from "./pages/HumanIntervention";
import EngineeringDrawings from "./pages/EngineeringDrawings";
import ExtractDetails from "./pages/ExtractDetails";
import MaterialCostEstimation from "./pages/MaterialCostEstimation";
import ManufacturingCost1 from "./pages/ManufacturingCost1";
import ManufacturingCost2 from "./pages/ManufacturingCost2";
import ProductionCost from "./pages/ProductionCost";
import ShouldCost from "./pages/ShouldCost";
import QuotationCost from "./pages/QuotationCost";
import NotFound from "./pages/NotFound";
import FinalQuotation from "./pages/FinalQuotation";
import TargetCostEstimation from "./pages/TargetCostEstimation";
import UploadEngineeringDiagram from "./pages/UploadEngineeringDiagram";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CostEstimationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/plans" element={<PlanSelection />} />
            <Route path="/project-details" element={<ProjectDetails />} />
            <Route path="/bill-of-materials" element={<BillOfMaterials />} />
            <Route path="/human-intervention" element={<HumanIntervention />} />
            <Route path="/engineering-drawings" element={<EngineeringDrawings />} />
            <Route path="/extract-details" element={<ExtractDetails />} />
            <Route path="/material-cost" element={<MaterialCostEstimation />} />
            <Route path="/manufacturing-cost-1" element={<ManufacturingCost1 />} />
            <Route path="/manufacturing-cost-2" element={<ManufacturingCost2 />} />
            <Route path="/production-cost" element={<ProductionCost />} />
            <Route path="/should-cost" element={<ShouldCost />} />
            <Route path="/quotation-cost" element={<QuotationCost />} />
            <Route path="/final-quotation" element={<FinalQuotation />} />
            <Route path="/target-cost-estimation" element={<TargetCostEstimation />} />
            <Route path="/upload-engineering-diagram" element={<UploadEngineeringDiagram />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CostEstimationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
