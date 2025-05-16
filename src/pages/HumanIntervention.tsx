
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { HumanIntervention as HumanInterventionType } from "@/types/cost-estimation";
import ParameterSection from "@/components/human-intervention/ParameterSection";
import ParameterControl from "@/components/human-intervention/ParameterControl";

const HumanIntervention = () => {
  const { humanIntervention, setHumanIntervention, projectDetails } = useCostEstimation();
  
  const [localIntervention, setLocalIntervention] = useState<HumanInterventionType>({
    ...humanIntervention
  });

  const handleValueChange = (key: keyof HumanInterventionType, value: number) => {
    setLocalIntervention((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSliderChange = (key: keyof HumanInterventionType, values: number[]) => {
    if (values.length > 0) {
      handleValueChange(key, values[0]);
    }
  };

  const handleSave = () => {
    setHumanIntervention(localIntervention);
  };

  return (
    <PageLayout
      title="Cost Estimation - Human Intervention"
      previousPage="/bill-of-materials"
      nextPage="/material-cost"
      nextButtonText="Continue to Material Cost"
    >
      <Navigation />

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Human Intervention Parameters</h2>
          <p className="text-gray-600">
            Adjust the parameters below to influence the cost calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ParameterSection title="Pricing Parameters">
            {projectDetails.firmPrice && (
              <ParameterControl
                label="Firm Price Percentage"
                value={localIntervention.firmPricePercentage}
                onChange={(value) => handleValueChange("firmPricePercentage", value)}
                onSliderChange={(values) => handleSliderChange("firmPricePercentage", values)}
                min={0}
                max={30}
                step={0.5}
                unit="%"
              />
            )}

            <ParameterControl
              label="Overhead Percentage"
              value={localIntervention.overheadPercentage}
              onChange={(value) => handleValueChange("overheadPercentage", value)}
              onSliderChange={(values) => handleSliderChange("overheadPercentage", values)}
              min={0}
              max={50}
              step={0.5}
              unit="%"
            />

            <ParameterControl
              label="Waste Percentage"
              value={localIntervention.wastePercentage}
              onChange={(value) => handleValueChange("wastePercentage", value)}
              onSliderChange={(values) => handleSliderChange("wastePercentage", values)}
              min={0}
              max={20}
              step={0.5}
              unit="%"
            />
          </ParameterSection>

          <ParameterSection title="Commercial Parameters">
            <ParameterControl
              label="Commercial Overhead Percentage"
              value={localIntervention.commercialOverheadPercentage}
              onChange={(value) => handleValueChange("commercialOverheadPercentage", value)}
              onSliderChange={(values) => handleSliderChange("commercialOverheadPercentage", values)}
              min={0}
              max={50}
              step={0.5}
              unit="%"
            />

            <ParameterControl
              label="Profit Margin Percentage"
              value={localIntervention.profitMarginPercentage}
              onChange={(value) => handleValueChange("profitMarginPercentage", value)}
              onSliderChange={(values) => handleSliderChange("profitMarginPercentage", values)}
              min={0}
              max={50}
              step={0.5}
              unit="%"
            />

            <ParameterControl
              label="Negotiation Percentage"
              value={localIntervention.negotiationPercentage}
              onChange={(value) => handleValueChange("negotiationPercentage", value)}
              onSliderChange={(values) => handleSliderChange("negotiationPercentage", values)}
              min={0}
              max={25}
              step={0.5}
              unit="%"
            />

            <ParameterControl
              label="Freight Per Kg"
              value={localIntervention.freightPerKg}
              onChange={(value) => handleValueChange("freightPerKg", value)}
              onSliderChange={(values) => handleSliderChange("freightPerKg", values)}
              min={0}
              max={500}
              step={5}
              unit=""
            />
          </ParameterSection>
        </div>
      </div>
    </PageLayout>
  );
};

export default HumanIntervention;
