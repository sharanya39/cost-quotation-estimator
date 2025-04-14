
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation, materialTable } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

const BillOfMaterials = () => {
  const navigate = useNavigate();
  const { materialItems, setMaterialItems } = useCostEstimation();
  const [items, setItems] = useState(
    materialItems.length > 0
      ? materialItems
      : [
          {
            itemNumber: 1,
            itemPartNumber: "",
            itemDescription: "",
            unitWeight: 0,
            quantity: 0,
            totalWeight: 0,
          },
        ]
  );

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculate total weight when unit weight or quantity changes
    if (field === "unitWeight" || field === "quantity") {
      const unitWeight = field === "unitWeight" ? Number(value) : updatedItems[index].unitWeight;
      const quantity = field === "quantity" ? Number(value) : updatedItems[index].quantity;
      updatedItems[index].totalWeight = unitWeight * quantity;
    }

    // Auto-fill from material table if item description matches
    if (field === "itemDescription") {
      const matchedMaterial = materialTable.find(
        (material) => material.title.toLowerCase().includes(value.toString().toLowerCase())
      );

      if (matchedMaterial) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemDescription: value.toString(),
          unitWeight: matchedMaterial.itemWeight,
          material: matchedMaterial.material,
          priceRange: matchedMaterial.priceRange,
        };
      }
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        itemNumber: items.length + 1,
        itemPartNumber: "",
        itemDescription: "",
        unitWeight: 0,
        quantity: 0,
        totalWeight: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      
      // Renumber items
      updatedItems.forEach((item, idx) => {
        item.itemNumber = idx + 1;
      });
      
      setItems(updatedItems);
    }
  };

  const handleSubmit = () => {
    // Filter out empty items
    const validItems = items.filter(
      (item) => item.itemPartNumber.trim() !== "" && item.itemDescription.trim() !== ""
    );
    
    if (validItems.length > 0) {
      setMaterialItems(validItems);
      navigate("/human-intervention");
    }
  };

  return (
    <PageLayout 
      title="Cost Estimation - Bill of Materials" 
      previousPage="/project-details"
      nextPage="/human-intervention"
      nextButtonText="Next"
    >
      <Navigation />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Bill of Materials / Item List</h2>
          <p className="text-gray-600">
            Enter the details of all items that are part of this project.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Item No.</TableHead>
                <TableHead className="w-32">Part Number</TableHead>
                <TableHead className="w-60">Item Description</TableHead>
                <TableHead className="w-32">Unit Weight (kg)</TableHead>
                <TableHead className="w-28">Quantity</TableHead>
                <TableHead className="w-36">Total Weight (kg)</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemNumber}</TableCell>
                  <TableCell>
                    <Input
                      value={item.itemPartNumber}
                      onChange={(e) => handleInputChange(index, "itemPartNumber", e.target.value)}
                      placeholder="Part number"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.itemDescription}
                      onChange={(e) => handleInputChange(index, "itemDescription", e.target.value)}
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unitWeight}
                      onChange={(e) => handleInputChange(index, "unitWeight", Number(e.target.value))}
                      placeholder="0.0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.totalWeight}
                      readOnly
                      placeholder="0.0"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={addItem} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          
          <Button onClick={handleSubmit} disabled={items.length === 0}>
            Continue to Human Intervention
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default BillOfMaterials;
