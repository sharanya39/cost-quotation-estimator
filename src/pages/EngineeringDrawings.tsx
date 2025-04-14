
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation, materialTable, engineeringTable } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EngineeringDrawings = () => {
  const navigate = useNavigate();
  const { materialItems, engineeringDetails, setEngineeringDetails } = useCostEstimation();
  const [drawings, setDrawings] = useState<{ 
    itemNumber: number;
    itemPartNumber: string;
    itemDescription: string;
    drawingNumber: string | null;
    drawingFound: boolean;
    fileUploaded: boolean;
  }[]>([]);

  useEffect(() => {
    // Initialize drawings from material items
    if (materialItems.length > 0 && drawings.length === 0) {
      const initialDrawings = materialItems.map(item => {
        // Find matching engineering details from database
        const matchedDrawing = engineeringTable.find(
          drawing => drawing.title.toLowerCase().includes(item.itemDescription.toLowerCase())
        );
        
        return {
          itemNumber: item.itemNumber,
          itemPartNumber: item.itemPartNumber,
          itemDescription: item.itemDescription,
          drawingNumber: matchedDrawing ? matchedDrawing.drawingNumber : null,
          drawingFound: !!matchedDrawing,
          fileUploaded: false
        };
      });
      
      setDrawings(initialDrawings);
    }
  }, [materialItems, drawings.length, engineeringTable]);

  const handleFileUpload = (index: number) => {
    // Simulate file upload
    const updatedDrawings = [...drawings];
    updatedDrawings[index].fileUploaded = true;
    setDrawings(updatedDrawings);
  };

  const handleSubmit = () => {
    // Convert drawings to engineering details
    const details = drawings
      .filter(drawing => drawing.drawingFound || drawing.fileUploaded)
      .map(drawing => {
        const matchedDrawing = engineeringTable.find(
          engDrawing => engDrawing.title.toLowerCase().includes(drawing.itemDescription.toLowerCase())
        );
        
        if (matchedDrawing) {
          return {
            title: matchedDrawing.title,
            drawingNumber: matchedDrawing.drawingNumber,
            length: matchedDrawing.length,
            width: matchedDrawing.width,
            thickness: matchedDrawing.thickness,
            holesSizesAndPosition: matchedDrawing.holesSizesAndPosition,
            tolerances: matchedDrawing.tolerances,
            scaleAndRevision: matchedDrawing.scaleAndRevision,
            authors: matchedDrawing.authors,
          };
        }
        
        // If we don't have a matched drawing but a file was uploaded
        // create a placeholder engineering detail
        return {
          title: drawing.itemDescription,
          drawingNumber: drawing.drawingNumber || "CUSTOM",
          length: 0,
          width: 0,
          thickness: 0,
          holesSizesAndPosition: "Custom",
          tolerances: "Custom",
          scaleAndRevision: "Custom",
          authors: "User Uploaded",
        };
      });
    
    setEngineeringDetails(details);
    navigate("/extract-details");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Engineering Drawings" 
      previousPage="/human-intervention"
      nextPage="/extract-details"
      nextButtonText="Extract Details"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Engineering Drawings</h2>
          <p className="text-gray-600">
            Review the engineering drawings for each item in your bill of materials. Upload drawings for items not found in the database.
          </p>
        </div>
        
        {drawings.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No items found</AlertTitle>
            <AlertDescription>
              Please go back to the Bill of Materials page and add items.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Number</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Drawing Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drawings.map((drawing, index) => (
                  <TableRow key={index}>
                    <TableCell>{drawing.itemNumber}</TableCell>
                    <TableCell>{drawing.itemPartNumber}</TableCell>
                    <TableCell>{drawing.itemDescription}</TableCell>
                    <TableCell>{drawing.drawingNumber || "Not found"}</TableCell>
                    <TableCell>
                      {drawing.drawingFound ? (
                        <span className="text-green-600 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Found in database
                        </span>
                      ) : drawing.fileUploaded ? (
                        <span className="text-blue-600 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Uploaded
                        </span>
                      ) : (
                        <span className="text-yellow-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Upload required
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!drawing.drawingFound && !drawing.fileUploaded && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleFileUpload(index)}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                      {(drawing.drawingFound || drawing.fileUploaded) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={drawings.length === 0 || !drawings.some(d => d.drawingFound || d.fileUploaded)}
          >
            Extract Details
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default EngineeringDrawings;
