
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Tool, Ruler, FileCode } from "lucide-react";
import { NonTechnicalAnalysis } from './components/NonTechnicalAnalysis';

const ExtractDetails = () => {
  const navigate = useNavigate();
  const { engineeringDetails, accessLevel } = useCostEstimation();
  const [viewType, setViewType] = useState<'technical' | 'non-technical'>('non-technical');

  const handleContinue = () => {
    if (accessLevel === 'premium') {
      navigate('/material-cost');
    } else {
      navigate('/plans');
    }
  };

  return (
    <PageLayout 
      title="Cost Estimation - Extract Details" 
      previousPage="/engineering-drawings"
      nextPage={accessLevel === 'premium' ? "/material-cost" : "/plans"}
      nextButtonText={accessLevel === 'premium' ? "Continue to Material Cost" : "Upgrade to Premium"}
      checkPremium={true}
      onNext={handleContinue}
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Engineering Drawing Analysis</h2>
          </div>
          <p className="text-gray-600">
            The system has analyzed the engineering drawings and extracted relevant details.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex flex-col items-center space-y-2">
            <img
              src="/lovable-uploads/d967ca13-f60a-4f75-b7a6-54df8821c549.png"
              alt="NeuronWorks.AI logo"
              className="h-20"
            />
            <span className="text-sm text-gray-500">AI Processing</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <img
              src="/lovable-uploads/4ab359a8-8389-45de-8eaa-0c3ba1cdb5fa.png"
              alt="RAMWIN logo"
              className="h-20"
            />
            <span className="text-sm text-gray-500">Engineering Analysis</span>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button 
            variant={viewType === 'technical' ? 'default' : 'outline'}
            onClick={() => setViewType('technical')}
            className="flex items-center gap-2"
          >
            <Tool className="h-4 w-4" />
            Technical
          </Button>
          <Button 
            variant={viewType === 'non-technical' ? 'default' : 'outline'}
            onClick={() => setViewType('non-technical')}
            className="flex items-center gap-2"
          >
            <FileCode className="h-4 w-4" />
            Non-Technical
          </Button>
        </div>

        {viewType === 'technical' ? (
          <div className="space-y-6">
            {engineeringDetails.length > 0 ? (
              engineeringDetails.map((detail, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
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
                              <TableCell>
                                {engineeringDetails.length > 0 
                                  ? (index === 0 ? "Stainless Steel 316" : 
                                     index === 1 ? "Aluminum 7075-T6" : 
                                     "Stainless Steel 304")
                                  : "Not specified"}
                              </TableCell>
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
                              <TableCell>Standard machining process with deburring</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No engineering details available. Please upload engineering drawings.
              </div>
            )}
          </div>
        ) : (
          <NonTechnicalAnalysis>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Non Technical Analysis</h3>
              <p>
                The engineering drawing provides comprehensive details about the component dimensions, 
                tolerances, and manufacturing requirements. The material specifications and 
                finishing requirements have been extracted to assist in cost estimation.
              </p>
            </div>
          </NonTechnicalAnalysis>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleContinue}
            className="flex items-center gap-2"
          >
            <Tool className="h-4 w-4" />
            {accessLevel === 'premium' 
              ? "Continue to Material Cost" 
              : "Upgrade to Premium for Material Cost Estimation"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtractDetails;
