
import React from "react";
import { Sliders } from "lucide-react";

interface ParameterSectionProps {
  title: string;
  children: React.ReactNode;
}

const ParameterSection = ({
  title,
  children
}: ParameterSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sliders className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ParameterSection;
