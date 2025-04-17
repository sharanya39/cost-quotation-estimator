
import React from "react";
import ParameterControl from "./ParameterControl";
import { Sliders } from "lucide-react";

interface Parameter {
  field: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface ParameterSectionProps {
  parameters: Parameter[];
  onParameterChange: (field: string, value: number) => void;
  onSliderChange: (field: string, value: number[]) => void;
}

const ParameterSection = ({
  parameters,
  onParameterChange,
  onSliderChange
}: ParameterSectionProps) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sliders className="h-6 w-6" />
          Human Intervention Parameters
        </h2>
        <p className="text-gray-600">
          Adjust the parameters below to fine-tune your cost estimation. These values will affect the final calculation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {parameters.map((param) => (
          <ParameterControl
            key={param.field}
            label={param.label}
            value={param.value}
            onChange={(value) => onParameterChange(param.field, value)}
            onSliderChange={(value) => onSliderChange(param.field, value)}
            min={param.min}
            max={param.max}
            step={param.step}
            unit={param.unit}
          />
        ))}
      </div>
    </div>
  );
};

export default ParameterSection;
