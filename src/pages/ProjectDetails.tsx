import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Navigation from "@/components/layout/Navigation";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectDetails, setProjectDetails, targetCostItems, setContractValue } = useCostEstimation();
  const [formState, setFormState] = useState({
    customerName: projectDetails.customerName || "",
    customerId: projectDetails.customerId || "",
    projectName: projectDetails.projectName || "",
    projectId: projectDetails.projectId || "",
    location: projectDetails.location || "",
    firmPrice: projectDetails.firmPrice || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, firmPrice: value === "yes" }));
  };

  const handleSubmit = (action: "quotation" | "target") => {
    setProjectDetails({
      customerName: formState.customerName,
      customerId: formState.customerId,
      projectName: formState.projectName,
      projectId: formState.projectId,
      location: formState.location,
      firmPrice: formState.firmPrice,
    });
    
    setContractValue(9000);

    if (action === "target" && targetCostItems.length > 0) {
      navigate("/target-cost-estimation");
    } else {
      navigate("/bill-of-materials");
    }
  };

  const isFormValid = () => {
    return (
      formState.customerName.trim() !== "" &&
      formState.customerId.trim() !== "" &&
      formState.projectName.trim() !== "" &&
      formState.projectId.trim() !== "" &&
      formState.location.trim() !== ""
    );
  };

  return (
    <PageLayout
      title="Cost Estimation - Project Details"
      previousPage="/"
      showNavigation={false}
    >
      <Navigation />

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Project Information</h2>
          <p className="text-gray-600">
            Enter the details about your project to get started with cost estimation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formState.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                name="customerId"
                value={formState.customerId}
                onChange={handleInputChange}
                placeholder="Enter customer ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="projectName"
                value={formState.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                name="projectId"
                value={formState.projectId}
                onChange={handleInputChange}
                placeholder="Enter project ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formState.location}
              onChange={handleInputChange}
              placeholder="Enter project location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firmPrice">Firm Price</Label>
            <RadioGroup
              value={formState.firmPrice ? "yes" : "no"}
              onValueChange={handleRadioChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="pt-6 flex justify-center space-x-4">
          <Button
            onClick={() => handleSubmit("quotation")}
            disabled={!isFormValid()}
            className="w-48"
          >
            Estimate Quotation Cost
          </Button>
          <Button
            onClick={() => handleSubmit("target")}
            disabled={!isFormValid() || targetCostItems.length === 0}
            variant="outline"
            className="w-48"
          >
            Estimate Target cost
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
