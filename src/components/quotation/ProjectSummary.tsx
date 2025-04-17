
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ProjectSummary = () => {
  const { projectDetails, materialItems } = useCostEstimation();
  
  // Calculate total items and quantities
  const totalItems = materialItems.length;
  const totalQuantity = materialItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = materialItems.reduce((sum, item) => sum + item.totalWeight, 0);
  
  // Format date
  const estimationDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Customer Name</TableCell>
                <TableCell>{projectDetails.customerName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Customer ID</TableCell>
                <TableCell>{projectDetails.customerId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Project Name</TableCell>
                <TableCell>{projectDetails.projectName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Project ID</TableCell>
                <TableCell>{projectDetails.projectId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Location</TableCell>
                <TableCell>{projectDetails.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Firm Price</TableCell>
                <TableCell>{projectDetails.firmPrice ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Estimation Summary</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total Items</TableCell>
                <TableCell>{totalItems}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Quantity</TableCell>
                <TableCell>{totalQuantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Weight</TableCell>
                <TableCell>{totalWeight.toFixed(2)} kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Estimation Date</TableCell>
                <TableCell>{estimationDate}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSummary;
