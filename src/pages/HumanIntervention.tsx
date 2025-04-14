
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const HumanIntervention = () => {
  const navigate = useNavigate();
  const { humanIntervention, setHumanIntervention } = useCostEstimation();
  
  const [values, setValues] = useState({
    firmPricePercentage: humanIntervention.firmPricePercentage,
    overheadPercentage: humanIntervention.overheadPercentage,
    wastePercentage: humanIntervention.wastePercentage,
    commercialOverheadPercentage: humanIntervention.commercialOverheadPercentage,
    profitMarginPercentage: humanIntervention.profitMarginPercentage,
    negotiationPercentage: humanIntervention.negotiationPercentage,
    freightPerKg: humanIntervention.freightPerKg
  });

  const handleInputChange = (field: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setValues(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const handleSubmit = () => {
    setHumanIntervention(values);
    navigate("/engineering-drawings");
  };

  return (
    <PageLayout 
      title="Cost Estimation - Human Intervention" 
      previousPage="/bill-of-materials"
      nextPage="/engineering-drawings"
      nextButtonText="Continue to Engineering Drawings"
    >
      <Navigation />
      
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Human Intervention Parameters</h2>
          <p className="text-gray-600">
            Adjust the parameters below to fine-tune your cost estimation. These values will affect the final calculation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Firm Price Percentage */}
          <ParameterControl
            label="Firm Price Percentage"
            value={values.firmPricePercentage}
            onChange={(value) => handleInputChange("firmPricePercentage", value)}
            onSliderChange={(value) => handleSliderChange("firmPricePercentage", value)}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
          
          {/* Overhead Percentage */}
          <ParameterControl
            label="Overhead Percentage"
            value={values.overheadPercentage}
            onChange={(value) => handleInputChange("overheadPercentage", value)}
            onSliderChange={(value) => handleSliderChange("overheadPercentage", value)}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
          
          {/* Waste Percentage */}
          <ParameterControl
            label="Waste Percentage"
            value={values.wastePercentage}
            onChange={(value) => handleInputChange("wastePercentage", value)}
            onSliderChange={(value) => handleSliderChange("wastePercentage", value)}
            min={0}
            max={20}
            step={1}
            unit="%"
          />
          
          {/* Commercial Overhead Percentage */}
          <ParameterControl
            label="Commercial Overhead Percentage"
            value={values.commercialOverheadPercentage}
            onChange={(value) => handleInputChange("commercialOverheadPercentage", value)}
            onSliderChange={(value) => handleSliderChange("commercialOverheadPercentage", value)}
            min={0}
            max={30}
            step={1}
            unit="%"
          />
          
          {/* Profit Margin Percentage */}
          <ParameterControl
            label="Profit Margin Percentage"
            value={values.profitMarginPercentage}
            onChange={(value) => handleInputChange("profitMarginPercentage", value)}
            onSliderChange={(value) => handleSliderChange("profitMarginPercentage", value)}
            min={0}
            max={50}
            step={1}
            unit="%"
          />
          
          {/* Negotiation Percentage */}
          <ParameterControl
            label="Negotiation Percentage"
            value={values.negotiationPercentage}
            onChange={(value) => handleInputChange("negotiationPercentage", value)}
            onSliderChange={(value) => handleSliderChange("negotiationPercentage", value)}
            min={0}
            max={20}
            step={1}
            unit="%"
          />
          
          {/* Freight Per Kg */}
          <ParameterControl
            label="Freight Per Kg"
            value={values.freightPerKg}
            onChange={(value) => handleInputChange("freightPerKg", value)}
            onSliderChange={(value) => handleSliderChange("freightPerKg", value)}
            min={0}
            max={200}
            step={5}
            unit="₹"
          />
        </div>
      </div>
    </PageLayout>
  );
};

interface ParameterControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onSliderChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const ParameterControl = ({
  label,
  value,
  onChange,
  onSliderChange,
  min,
  max,
  step,
  unit
}: ParameterControlProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium">
          {value}{unit}
        </span>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-grow">
          <Slider
            value={[value]}
            onValueChange={onSliderChange}
            min={min}
            max={max}
            step={step}
          />
        </div>
        
        <div className="w-20">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
    </div>
  );
};

export default HumanIntervention;
