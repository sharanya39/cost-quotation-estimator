
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Ruler } from "lucide-react";
import { EngineeringDetails } from '@/types/cost-estimation';

interface TechnicalDetailsCardProps {
  detail: EngineeringDetails;
  index: number;
}

const TechnicalDetailsCard = ({ detail, index }: TechnicalDetailsCardProps) => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Technical Specifications
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Title/Part Name</TableCell>
                  <TableCell>{detail.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Drawing Number</TableCell>
                  <TableCell>{detail.drawingNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Material</TableCell>
                  <TableCell>{detail.material || 'Not specified'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Dimensions & Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dimensions (L×W×T)</TableCell>
                  <TableCell>{detail.length} × {detail.width} × {detail.thickness} mm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hole Sizes and Positions</TableCell>
                  <TableCell>{detail.holesSizesAndPosition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tolerances</TableCell>
                  <TableCell>{detail.tolerances}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Scale and Revision</TableCell>
                  <TableCell>{detail.scaleAndRevision}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Authors</TableCell>
                  <TableCell>{detail.authors}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Processing Notes</TableCell>
                  <TableCell>{detail.surfaceTreatment || 'Standard machining process'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalDetailsCard;
