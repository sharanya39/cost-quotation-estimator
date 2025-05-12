
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext"; // Removed materialTable import
import { calculateL1Cost, formatINR } from "@/utils/calculations"; // Removed extractMedianPrice import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react"; // Removed FileText import

// Define interfaces for the fetched data
interface OpData {
  material: string;
  unit_weight_kg: number;
  // Add other fields from op.json if needed
}

interface PricingItem {
  code: string;
  price: number;
  // Add other fields from pricing.json if needed
}

interface PricingData {
  raw_materials: PricingItem[];
  // Add other top-level fields if needed
}

const MaterialCostEstimation = () => {
  const navigate = useNavigate();
  const {
    materialItems,
    currentItemIndex,
    // engineeringDetails, // No longer needed directly for grade/price
    humanIntervention,
    costBreakdowns,
    setCostBreakdowns
  } = useCostEstimation();

  const currentItem = materialItems[currentItemIndex];

  // State for fetched data
  const [opData, setOpData] = useState<OpData | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for calculation inputs - initialize with defaults or from context
  const [calculationInputs, setCalculationInputs] = useState({
    materialGrade: currentItem?.material || "Loading...", // Use context material initially or loading state
    pricePerKg: 0, // Default to 0 until fetched
    partWeight: currentItem?.unitWeight || 0,
    wastePercentage: humanIntervention.wastePercentage,
    firmPricePercentage: humanIntervention.firmPricePercentage
  });

  const [l1Costs, setL1Costs] = useState({
    l1CostPerKg: 0,
    l1CostPerPiece: 0
  });

  // Fetch op.json and pricing.json
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch op-data
        const opResponse = await fetch('http://localhost:3000/api/op-data');
        if (!opResponse.ok) throw new Error(`Failed to fetch op data: ${opResponse.statusText}`);
        const opResult = await opResponse.json();
        
        // Set op data
        setOpData({
          material: opResult.material,
          unit_weight_kg: opResult.unit_weight_kg
        });

        // Fetch material-price using material name as code
        const materialResponse = await fetch(`http://localhost:3000/api/material-price/${opResult.material}`);
        if (!materialResponse.ok) throw new Error(`Failed to fetch material price: ${materialResponse.statusText}`);
        const materialResult = await materialResponse.json();

        if (!materialResult.success) throw new Error(materialResult.error || 'Failed to load material price');

        // Set pricing data
        setPricingData({
          raw_materials: [{
            code: opResult.material,
            price: materialResult.price
          }]
        });
        console.log('Fetched material data:', {
          code: opResult.material,
          price: materialResult.price,
          date: materialResult.date,
          name: materialResult.name,
          source: materialResult.source,
          unit: materialResult.unit
        });

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load material data.");
        // Keep existing context values or defaults if fetch fails
        setCalculationInputs(prev => ({
          ...prev,
          materialGrade: currentItem?.material || "Error",
          partWeight: currentItem?.unitWeight || 0,
          wastePercentage: humanIntervention.wastePercentage,
          firmPricePercentage: humanIntervention.firmPricePercentage
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentItemIndex]); // Refetch if the item changes

  // Update calculation inputs when fetched data is available
  useEffect(() => {
    if (opData && pricingData && currentItem) {
      const materialGrade = opData.material;
      const pricingItem = pricingData.raw_materials.find(p => p.code === materialGrade);
      const pricePerKg = pricingItem ? pricingItem.price : 0; // Default to 0 if not found
      const partWeight = currentItem.unitWeight; // Use weight from context (potentially updated in BOM)

      console.log('Setting calculation inputs:', {
        materialGrade,
        pricePerKg,
        partWeight,
        wastePercentage: humanIntervention.wastePercentage,
        firmPricePercentage: humanIntervention.firmPricePercentage
      });

      setCalculationInputs(prev => ({
        ...prev,
        materialGrade: materialGrade || "Not Found",
        pricePerKg: pricePerKg,
        partWeight: partWeight,
        // Keep waste and firm price percentages from context/humanIntervention
        wastePercentage: humanIntervention.wastePercentage,
        firmPricePercentage: humanIntervention.firmPricePercentage
      }));
    } else if (currentItem) {
        // Fallback if data fetch fails or is pending, use context values
        setCalculationInputs(prev => ({
            ...prev,
            materialGrade: currentItem.material || (isLoading ? "Loading..." : "Error/Not Found"),
            pricePerKg: 0, // Or perhaps fetch from materialTable as fallback?
            partWeight: currentItem.unitWeight || 0,
            wastePercentage: humanIntervention.wastePercentage,
            firmPricePercentage: humanIntervention.firmPricePercentage
        }));
    }
  }, [opData, pricingData, currentItem, humanIntervention, isLoading]);

  // Recalculate whenever inputs change
  useEffect(() => {
    // Ensure calculation runs only when inputs are valid numbers
    if (
      !isNaN(calculationInputs.partWeight) &&
      !isNaN(calculationInputs.wastePercentage) &&
      !isNaN(calculationInputs.pricePerKg) &&
      !isNaN(calculationInputs.firmPricePercentage)
    ) {
        calculateCosts();
    }
  }, [calculationInputs]);

  const handleInputChange = (field: string, value: string | number) => {
    // Ensure numeric fields are parsed correctly
    const numericValue = (field === 'pricePerKg' || field === 'partWeight' || field === 'wastePercentage' || field === 'firmPricePercentage')
      ? parseFloat(String(value))
      : value;

    setCalculationInputs(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const calculateCosts = () => {
    // Add checks for NaN before calculation
    const weight = isNaN(calculationInputs.partWeight) ? 0 : calculationInputs.partWeight;
    const waste = isNaN(calculationInputs.wastePercentage) ? 0 : calculationInputs.wastePercentage;
    const price = isNaN(calculationInputs.pricePerKg) ? 0 : calculationInputs.pricePerKg;
    const firm = isNaN(calculationInputs.firmPricePercentage) ? 0 : calculationInputs.firmPricePercentage;

    const l1CostPerKg = calculateL1Cost(
      1, // Per kg calculation
      waste,
      price,
      firm
    );

    const l1CostPerPiece = l1CostPerKg * weight;

    setL1Costs({
      l1CostPerKg: isNaN(l1CostPerKg) ? 0 : l1CostPerKg,
      l1CostPerPiece: isNaN(l1CostPerPiece) ? 0 : l1CostPerPiece
    });
  };

  const handleSubmit = () => {
    // Update or add cost breakdown for this item
    const existingBreakdownIndex = costBreakdowns.findIndex(
      (_, index) => index === currentItemIndex
    );

    const newBreakdown = {
      ...costBreakdowns[existingBreakdownIndex] || {},
      l1CostPerKg: l1Costs.l1CostPerKg,
      l1CostPerPiece: l1Costs.l1CostPerPiece
    };

    const updatedBreakdowns = [...costBreakdowns];

    if (existingBreakdownIndex >= 0) {
      updatedBreakdowns[existingBreakdownIndex] = newBreakdown;
    } else {
      // Ensure we don't add beyond the current index if it's the first time
      if (updatedBreakdowns.length === currentItemIndex) {
          updatedBreakdowns.push(newBreakdown);
      } else {
          // Handle potential array index issues if needed, though typically should match
          updatedBreakdowns[currentItemIndex] = newBreakdown;
      }
    }

    setCostBreakdowns(updatedBreakdowns);
    navigate("/manufacturing-cost-1");
  };

  // Display loading or error state
  if (isLoading && !opData && !pricingData) {
      return (
          <PageLayout title="Loading Material Data...">
              <Navigation />
              <div className="flex justify-center items-center h-64">
                  Loading material details...
              </div>
          </PageLayout>
      );
  }

  if (error) {
      return (
          <PageLayout title="Error Loading Data">
              <Navigation />
              <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50">
                  Error: {error}
              </div>
          </PageLayout>
      );
  }

  return (
    <PageLayout
      title="Cost Estimation - Material Cost (L1)"
      previousPage="/human-intervention" // Corrected previous page
      nextPage="/manufacturing-cost-1"
      nextButtonText="Next: Manufacturing Cost"
    >
      <Navigation />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Material Cost Estimation (L1)</h2>
            <div className="text-sm text-gray-500">
              Item: {currentItem?.itemDescription || 'N/A'} (Part #: {currentItem?.itemPartNumber || 'N/A'})
            </div>
          </div>
          <p className="text-gray-600">
            Calculate the L1 cost based on material specifications, waste percentage, and firm price adjustments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="materialGrade">Material Grade</Label>
                  <Input
                    id="materialGrade"
                    value={calculationInputs.materialGrade}
                    readOnly // Grade is now fetched, not editable here
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">
                    Fetched from drawing analysis (op.json).
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="pricePerKg">Price Per Kg (₹)</Label>
                  <Input
                    id="pricePerKg"
                    type="number"
                    value={calculationInputs.pricePerKg.toFixed(2)} // Format for display
                    onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Fetched from pricing data based on grade. Can be overridden.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="partWeight">Part Weight (kg)</Label>
                  <Input
                    id="partWeight"
                    type="number"
                    value={calculationInputs.partWeight.toFixed(3)} // Format for display
                    onChange={(e) => handleInputChange("partWeight", e.target.value)}
                    step="0.001"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From Bill of Materials / op.json. Can be overridden.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="wastePercentage">Waste Percentage (%)</Label>
                  <Input
                    id="wastePercentage"
                    type="number"
                    value={calculationInputs.wastePercentage}
                    onChange={(e) => handleInputChange("wastePercentage", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From human intervention settings. Can be overridden.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="firmPricePercentage">Firm Price Percentage (%)</Label>
                  <Input
                    id="firmPricePercentage"
                    type="number"
                    value={calculationInputs.firmPricePercentage}
                    onChange={(e) => handleInputChange("firmPricePercentage", e.target.value)}
                    step="0.1"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    From human intervention settings. Can be overridden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>L1 Cost Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">L1 Cost Per Kg</Label>
                  <div className="text-3xl font-semibold">{formatINR(l1Costs.l1CostPerKg)}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">L1 Cost Per Piece</Label>
                  <div className="text-3xl font-semibold">{formatINR(l1Costs.l1CostPerPiece)}</div>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <p className="font-medium">Calculation Formula:</p>
                  <p>L1/kg = Price/kg × (1 + Waste%) × (1 + Firm%)</p>
                  <p>L1/pc = L1/kg × Part Weight</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full mt-4 flex items-center justify-center"
                  disabled={isLoading || !!error} // Disable button if loading or error
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Continue to Manufacturing Cost
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default MaterialCostEstimation;
