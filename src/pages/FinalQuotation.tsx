
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { format } from "date-fns";

const FinalQuotation = () => {
  const navigate = useNavigate();
  const { 
    projectDetails, 
    materialItems, 
    costBreakdowns,
    humanIntervention
  } = useCostEstimation();

  const totalQuantity = materialItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = materialItems.reduce((sum, item) => sum + item.totalWeight, 0);

  const handleDownload = () => {
    exportToExcel(materialItems, costBreakdowns);
  };

  const handleStartNew = () => {
    navigate("/");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Final Quotation" 
      previousPage="/quotation-cost"
      showNavigation={false}
    >
      <Navigation />
      
      <div className="space-y-6 bg-[#F2FCE2] p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Customer Name:</div>
                <div>{projectDetails.customerName}</div>
                
                <div className="text-sm font-medium">Customer ID:</div>
                <div>{projectDetails.customerId}</div>
                
                <div className="text-sm font-medium">Project Name:</div>
                <div>{projectDetails.projectName}</div>
                
                <div className="text-sm font-medium">Project ID:</div>
                <div>{projectDetails.projectId}</div>
                
                <div className="text-sm font-medium">Location:</div>
                <div>{projectDetails.location}</div>
                
                <div className="text-sm font-medium">Firm Price:</div>
                <div>{projectDetails.firmPrice ? "Yes" : "No"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Estimation Summary */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Estimation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Total Items:</div>
                <div>{materialItems.length}</div>
                
                <div className="text-sm font-medium">Estimation Date:</div>
                <div>{format(new Date(), "dd/MM/yyyy")}</div>
                
                <div className="text-sm font-medium">Total Quantity:</div>
                <div>{totalQuantity} pieces</div>
                
                <div className="text-sm font-medium">Total Weight:</div>
                <div>{totalWeight.toFixed(2)} kg</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotation Details Table */}
        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F2FCE2]">
                    <TableHead>S.No</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>L1 Cost/kg</TableHead>
                    <TableHead>L2 Cost/kg</TableHead>
                    <TableHead>L3 Cost/kg</TableHead>
                    <TableHead>L4 Cost/kg</TableHead>
                    <TableHead>L5 Cost/kg</TableHead>
                    <TableHead>L5 Cost/piece</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Freight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialItems.map((item, index) => {
                    const cost = costBreakdowns[index] || {
                      l1CostPerKg: 0,
                      l2CostPerKg: 0,
                      l3CostPerKg: 0,
                      l4CostPerKg: 0,
                      l5CostPerKg: 0,
                      l5CostPerPiece: 0,
                      totalQuotationCost: 0
                    };
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.itemPartNumber}</TableCell>
                        <TableCell>{item.itemDescription}</TableCell>
                        <TableCell>{item.unitWeight}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{cost.l1CostPerKg.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.l2CostPerKg.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.l3CostPerKg.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.l4CostPerKg.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.l5CostPerKg.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.l5CostPerPiece.toFixed(2)}</TableCell>
                        <TableCell>₹{cost.totalQuotationCost.toFixed(2)}</TableCell>
                        <TableCell>₹{humanIntervention.freightPerKg}/kg</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button onClick={handleStartNew} variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Estimation
          </Button>
          <Button onClick={handleDownload} className="flex items-center bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="mr-2 h-4 w-4" />
            Download Excel Report
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default FinalQuotation;
