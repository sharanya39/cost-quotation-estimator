
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wrench, FileText } from "lucide-react";

interface ViewTypeToggleProps {
  viewType: 'technical' | 'non-technical';
  onViewTypeChange: (type: 'technical' | 'non-technical') => void;
}

const ViewTypeToggle = ({ viewType, onViewTypeChange }: ViewTypeToggleProps) => {
  return (
    <div className="flex space-x-4 mb-6">
      <Button 
        variant={viewType === 'technical' ? 'default' : 'outline'}
        onClick={() => onViewTypeChange('technical')}
        className="flex items-center gap-2"
      >
        <Wrench className="h-4 w-4" />
        Technical
      </Button>
      <Button 
        variant={viewType === 'non-technical' ? 'default' : 'outline'}
        onClick={() => onViewTypeChange('non-technical')}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Non-Technical
      </Button>
    </div>
  );
};

export default ViewTypeToggle;
