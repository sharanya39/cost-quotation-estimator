
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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

export default ParameterControl;
