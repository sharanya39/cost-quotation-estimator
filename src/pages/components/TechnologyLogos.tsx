
import React from 'react';

const TechnologyLogos = () => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <div className="flex flex-col items-center space-y-2">
        <img
          src="/lovable-uploads/d967ca13-f60a-4f75-b7a6-54df8821c549.png"
          alt="NeuronWorks.AI logo"
          className="h-20"
        />
        <span className="text-sm text-gray-500">AI Processing</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <img
          src="/lovable-uploads/4ab359a8-8389-45de-8eaa-0c3ba1cdb5fa.png"
          alt="RAMWIN logo"
          className="h-20"
        />
        <span className="text-sm text-gray-500">Engineering Analysis</span>
      </div>
    </div>
  );
};

export default TechnologyLogos;
