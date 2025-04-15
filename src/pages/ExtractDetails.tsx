
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation, materialTable, engineeringTable } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { FileText, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ExtractDetails = () => {
  const navigate = useNavigate();
  const { materialItems, engineeringDetails, accessLevel } = useCostEstimation();
  
  const handleTechnical = () => {
    if (accessLevel === "basic") {
      navigate("/plans");
    } else {
      navigate("/material-cost");
    }
  };
  
  const handleNonTechnical = () => {
    if (accessLevel === "basic") {
      navigate("/plans");
    } else {
      navigate("/final-quotation");
    }
  };
  
  // Get details for the first item
  const currentItem = materialItems[0] || null;
  
  // Find engineering details for the current item
  const currentEngDetails = engineeringDetails.find(
    detail => detail.title.toLowerCase().includes(currentItem?.itemDescription.toLowerCase() || "")
  );
  
  // Find material details for the current item
  const currentMaterialDetails = materialTable.find(
    material => material.title.toLowerCase().includes(currentItem?.itemDescription.toLowerCase() || "")
  );
  
  return (
    <PageLayout 
      title="Cost Estimation - Extract Details" 
      previousPage="/engineering-drawings"
      checkPremium={true}
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Extract Details</h2>
          <p className="text-gray-600">
            Review the extracted technical details for your items.
          </p>
        </div>
        
        {!currentItem || !currentEngDetails ? (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Details Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no items with extracted details available. Please make sure you have added items to your bill of materials and uploaded or selected engineering drawings.
            </p>
          </div>
        ) : (
          <div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Item Details</TabsTrigger>
                <TabsTrigger value="engineering">Engineering Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentItem.itemDescription}</CardTitle>
                    <CardDescription>Part Number: {currentItem.itemPartNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Title/Part Name" value={currentItem.itemDescription} />
                      <DetailItem label="Drawing Number" value={currentEngDetails.drawingNumber} />
                      <DetailItem label="Material" value={currentMaterialDetails?.material || "Not specified"} />
                      <DetailItem label="Price Range" value={currentMaterialDetails?.priceRange || "Not specified"} />
                      <DetailItem label="Unit Weight" value={`${currentItem.unitWeight} kg`} />
                      <DetailItem label="Quantity" value={currentItem.quantity.toString()} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="engineering" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering Specifications</CardTitle>
                    <CardDescription>Technical drawing specifications and dimensions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Overall Dimensions" 
                        value={`${currentEngDetails.length} × ${currentEngDetails.width} × ${currentEngDetails.thickness} mm`} 
                      />
                      <DetailItem label="Hole Sizes and Positions" 
                        value={currentEngDetails.holesSizesAndPosition} 
                      />
                      <DetailItem label="Tolerances & Surface Finish" 
                        value={currentEngDetails.tolerances} 
                      />
                      <DetailItem label="Scale and Revision" 
                        value={currentEngDetails.scaleAndRevision} 
                      />
                      <DetailItem label="Authors & Approvers" 
                        value={currentEngDetails.authors} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <Button 
                onClick={handleTechnical}
                className="flex items-center bg-[#00BFB3] hover:bg-[#00BFB3]/90"
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Technical Analysis
              </Button>
              
              <Button 
                onClick={handleNonTechnical}
                variant="outline"
                className="flex items-center"
                size="lg"
              >
                <Info className="mr-2 h-5 w-5" />
                Non-Technical Summary
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium text-gray-500">{label}</Label>
    <div className="text-base font-medium">{value}</div>
  </div>
);

export default ExtractDetails;
