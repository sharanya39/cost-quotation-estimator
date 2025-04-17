
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import ParameterSection from "@/components/human-intervention/ParameterSection";

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

  const parameters = [
    {
      field: "firmPricePercentage",
      label: "Firm Price Percentage",
      value: values.firmPricePercentage,
      min: 0,
      max: 30,
      step: 1,
      unit: "%"
    },
    {
      field: "overheadPercentage",
      label: "Overhead Percentage",
      value: values.overheadPercentage,
      min: 0,
      max: 30,
      step: 1,
      unit: "%"
    },
    {
      field: "wastePercentage",
      label: "Waste Percentage",
      value: values.wastePercentage,
      min: 0,
      max: 20,
      step: 1,
      unit: "%"
    },
    {
      field: "commercialOverheadPercentage",
      label: "Commercial Overhead Percentage",
      value: values.commercialOverheadPercentage,
      min: 0,
      max: 30,
      step: 1,
      unit: "%"
    },
    {
      field: "profitMarginPercentage",
      label: "Profit Margin Percentage",
      value: values.profitMarginPercentage,
      min: 0,
      max: 50,
      step: 1,
      unit: "%"
    },
    {
      field: "negotiationPercentage",
      label: "Negotiation Percentage",
      value: values.negotiationPercentage,
      min: 0,
      max: 20,
      step: 1,
      unit: "%"
    },
    {
      field: "freightPerKg",
      label: "Freight Per Kg",
      value: values.freightPerKg,
      min: 0,
      max: 200,
      step: 5,
      unit: "₹"
    }
  ];

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
      onNext={handleSubmit}
    >
      <Navigation />
      <ParameterSection 
        parameters={parameters}
        onParameterChange={handleInputChange}
        onSliderChange={handleSliderChange}
      />
    </PageLayout>
  );
};

export default HumanIntervention;
