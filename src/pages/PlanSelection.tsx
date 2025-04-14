
import { useNavigate } from "react-router-dom";
import { useCostEstimation } from "@/contexts/CostEstimationContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PlanSelection = () => {
  const navigate = useNavigate();
  const { setAccessLevel } = useCostEstimation();

  const handleSelectPlan = (plan: "basic" | "premium") => {
    setAccessLevel(plan);
    navigate("/project-details");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <div className="flex space-x-4">
            <img
              src="/lovable-uploads/d967ca13-f60a-4f75-b7a6-54df8821c549.png"
              alt="NeuronWorks.AI logo"
              className="h-10"
            />
            <img
              src="/lovable-uploads/4ab359a8-8389-45de-8eaa-0c3ba1cdb5fa.png"
              alt="RAMWIN logo"
              className="h-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Select the right plan for your estimation needs
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform hover:scale-105">
              <div className="bg-blue-50 p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <PlanFeature text="Project Details Management" />
                  <PlanFeature text="Bill of Materials Entry" />
                  <PlanFeature text="Human Intervention Settings" />
                  <PlanFeature text="Engineering Drawing Management" />
                  <PlanFeature text="Details Extraction" />
                  <PlanFeature text="Limited Access to Cost Estimation" />
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan("basic")} 
                  className="w-full"
                  variant="outline"
                >
                  Select Basic Plan
                </Button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500 transition-transform hover:scale-105">
              <div className="bg-blue-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <p>Complete cost estimation solution</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <PlanFeature text="Everything in Basic Plan" />
                  <PlanFeature text="Full Material Cost Estimation" />
                  <PlanFeature text="Manufacturing Cost Calculation" />
                  <PlanFeature text="Production Cost Analysis" />
                  <PlanFeature text="Should Cost Reporting" />
                  <PlanFeature text="Quotation Cost Generation" />
                  <PlanFeature text="Excel Export Functionality" />
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan("premium")} 
                  className="w-full"
                >
                  Select Premium Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto flex justify-center items-center text-sm text-gray-500">
          <span>© NeuronWorks.AI & RAMWIN, All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

const PlanFeature = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

export default PlanSelection;
