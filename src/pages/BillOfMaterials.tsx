
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation, materialTable } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MaterialTable from "@/components/material/MaterialTable";

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

    if (field === "unitWeight" || field === "quantity") {
      const unitWeight = field === "unitWeight" ? Number(value) : updatedItems[index].unitWeight;
      const quantity = field === "quantity" ? Number(value) : updatedItems[index].quantity;
      updatedItems[index].totalWeight = unitWeight * quantity;
    }

    if (field === "itemPartNumber") {
      const matchedMaterial = materialTable.find(
        (material) => material.partNumber === value
      );

      if (matchedMaterial) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemDescription: matchedMaterial.title,
          unitWeight: matchedMaterial.itemWeight,
          material: matchedMaterial.material,
          priceRange: matchedMaterial.priceRange,
          itemPartNumber: value,
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
      updatedItems.forEach((item, idx) => {
        item.itemNumber = idx + 1;
      });
      setItems(updatedItems);
    }
  };

  const handleSubmit = () => {
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
        
        <MaterialTable
          items={items}
          onInputChange={handleInputChange}
          onRemoveItem={removeItem}
        />
        
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
