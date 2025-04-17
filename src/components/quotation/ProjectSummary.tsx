
import React from 'react';
import { useCostEstimation } from "@/contexts/CostEstimationContext";

const ProjectSummary = () => {
  const { projectDetails } = useCostEstimation();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Project Details</h3>
      <div className="space-y-2">
        <p>Customer Name: {projectDetails.customerName}</p>
        <p>Project Name: {projectDetails.projectName}</p>
        <p>Project ID: {projectDetails.projectId}</p>
        <p>Location: {projectDetails.location}</p>
      </div>
    </div>
  );
};

export default ProjectSummary;
