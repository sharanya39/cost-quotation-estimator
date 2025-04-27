
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { calculateSetupTimePerPiece, calculateSetupCost, calculateCycleCost, formatINR } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

// Define the structure for a manufacturing process
interface MfgProcess {
  id: number;
  process: string;
  setupTimePerBatch: number;
  batchQuantity: number;
  setupTimePerPiece: number;
  cycleTimePerPiece: number;
  machineHourRate: number;
  setupCost: number;
  cycleCost: number;
}

const ManufacturingCost1 = () => {
  const navigate = useNavigate();
  const { materialItems, currentItemIndex, manufacturingProcesses, setManufacturingProcesses } = useCostEstimation();
  
  const currentItem = materialItems[currentItemIndex];
  
  // Initialize with default processes if none exist
  const [processes, setProcesses] = useState<MfgProcess[]>([
    {
      id: 1,
      process: "VMC",
      setupTimePerBatch: 20,
      batchQuantity: 20,
      setupTimePerPiece: 1,
      cycleTimePerPiece: 30,
      machineHourRate: 450,
      setupCost: 7.5,
      cycleCost: 225
    },
    {
      id: 2,
      process: "Slide Grinding",
      setupTimePerBatch: 10,
      batchQuantity: 20,
      setupTimePerPiece: 0.5,
      cycleTimePerPiece: 15,
      machineHourRate: 600,
      setupCost: 5,
      cycleCost: 150
    }
  ]);
  
  const [totals, setTotals] = useState({
    totalSetupCostPerPiece: 0,
    totalCycleCostPerPiece: 0,
    totalSetupCostPerKg: 0,
    totalCycleCostPerKg: 0
  });
  
  // Calculate derived values and totals whenever processes change
  useEffect(() => {
    recalculateAll();
  }, [processes]);
  
  const recalculateAll = () => {
    // First update each process's derived values
    const updatedProcesses = processes.map(process => {
      const setupTimePerPiece = calculateSetupTimePerPiece(
        process.setupTimePerBatch,
        process.batchQuantity
      );
      
      const setupCost = calculateSetupCost(
        setupTimePerPiece,
        process.machineHourRate
      );
      
      const cycleCost = calculateCycleCost(
        process.cycleTimePerPiece,
        process.machineHourRate
      );
      
      return {
        ...process,
        setupTimePerPiece,
        setupCost,
        cycleCost
      };
    });
    
    setProcesses(updatedProcesses);
    
    // Calculate totals
    const totalSetupCostPerPiece = updatedProcesses.reduce(
      (sum, process) => sum + process.setupCost,
      0
    );
    
    const totalCycleCostPerPiece = updatedProcesses.reduce(
      (sum, process) => sum + process.cycleCost,
      0
    );
    
    // Per kg calculations (if weight is available)
    console.log("Current item:", currentItem);
    console.log("Weight:", currentItem?.unitWeight);
    const weight = currentItem?.unitWeight || 1;
    const totalSetupCostPerKg = totalSetupCostPerPiece / weight;
    const totalCycleCostPerKg = totalCycleCostPerPiece / weight;
    
    setTotals({
      totalSetupCostPerPiece,
      totalCycleCostPerPiece,
      totalSetupCostPerKg,
      totalCycleCostPerKg
    });
  };
  
  const handleInputChange = (id: number, field: string, value: string | number) => {
    const updatedProcesses = processes.map(process => {
      if (process.id === id) {
        return {
          ...process,
          [field]: typeof value === 'string' ? parseFloat(value) : value
        };
      }
      return process;
    });
    
    setProcesses(updatedProcesses);
  };
  
  const addProcess = () => {
    const newId = Math.max(...processes.map(p => p.id), 0) + 1;
    
    setProcesses([
      ...processes,
      {
        id: newId,
        process: "",
        setupTimePerBatch: 0,
        batchQuantity: 0,
        setupTimePerPiece: 0,
        cycleTimePerPiece: 0,
        machineHourRate: 0,
        setupCost: 0,
        cycleCost: 0
      }
    ]);
  };
  
  const removeProcess = (id: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(process => process.id !== id));
    }
  };
  
  const handleSubmit = () => {
    // Save manufacturing processes to context
    setManufacturingProcesses(
      processes.map(p => ({
        process: p.process,
        setupTimePerBatch: p.setupTimePerBatch,
        batchQuantity: p.batchQuantity,
        setupTimePerPiece: p.setupTimePerPiece,
        cycleTimePerPiece: p.cycleTimePerPiece,
        machineHourRate: p.machineHourRate,
        setupCost: p.setupCost,
        cycleCost: p.cycleCost
      }))
    );
    
    navigate("/manufacturing-cost-2");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Manufacturing Cost 1" 
      previousPage="/material-cost"
      nextPage="/manufacturing-cost-2"
      nextButtonText="Next: Manufacturing Cost 2"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Manufacturing Cost (L2) - Machine Processes</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription} (Part #: {currentItem?.itemPartNumber})
            </div>
          </div>
          <p className="text-gray-600">
            Enter the manufacturing processes, setup times, and cycle times to calculate the manufacturing costs.
          </p>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Machine Process</TableHead>
                <TableHead>Setup Time Per Batch (mins)</TableHead>
                <TableHead>Batch Quantity</TableHead>
                <TableHead>Setup Time Per Piece (mins)</TableHead>
                <TableHead>Cycle Time Per Piece (mins)</TableHead>
                <TableHead>Machine Hour Rate</TableHead>
                <TableHead className="bg-blue-50">Setup Cost</TableHead>
                <TableHead className="bg-blue-50">Cycle Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>
                    <Input 
                      value={process.process}
                      onChange={(e) => handleInputChange(process.id, "process", e.target.value)}
                      placeholder="Process name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={process.setupTimePerBatch}
                      onChange={(e) => handleInputChange(process.id, "setupTimePerBatch", e.target.value)}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={process.batchQuantity}
                      onChange={(e) => handleInputChange(process.id, "batchQuantity", e.target.value)}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={process.setupTimePerPiece}
                      readOnly
                      className="bg-gray-50"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={process.cycleTimePerPiece}
                      onChange={(e) => handleInputChange(process.id, "cycleTimePerPiece", e.target.value)}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={process.machineHourRate}
                      onChange={(e) => handleInputChange(process.id, "machineHourRate", e.target.value)}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="bg-blue-50">
                    <Input 
                      type="number"
                      value={process.setupCost.toFixed(2)}
                      readOnly
                      className="bg-blue-50"
                    />
                  </TableCell>
                  <TableCell className="bg-blue-50">
                    <Input 
                      type="number"
                      value={process.cycleCost.toFixed(2)}
                      readOnly
                      className="bg-blue-50"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProcess(process.id)}
                      disabled={processes.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals row */}
              <TableRow className="bg-gray-100 font-medium">
                <TableCell colSpan={6} className="text-right">
                  Total Per Piece
                </TableCell>
                <TableCell className="bg-blue-100">
                  {formatINR(totals.totalSetupCostPerPiece)}
                </TableCell>
                <TableCell className="bg-blue-100">
                  {formatINR(totals.totalCycleCostPerPiece)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              
              <TableRow className="bg-gray-100 font-medium">
                <TableCell colSpan={6} className="text-right">
                  Total Per Kg
                </TableCell>
                <TableCell className="bg-blue-100">
                  {formatINR(totals.totalSetupCostPerKg)}
                </TableCell>
                <TableCell className="bg-blue-100">
                  {formatINR(totals.totalCycleCostPerKg)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={addProcess}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Process
          </Button>
          
          <Button onClick={handleSubmit}>
            Continue to Manufacturing Cost 2
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ManufacturingCost1;
