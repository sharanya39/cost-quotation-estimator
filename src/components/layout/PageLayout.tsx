
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCostEstimation } from "@/contexts/CostEstimationContext";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  showNavigation?: boolean;
  previousPage?: string;
  nextPage?: string;
  nextButtonText?: string;
  previousButtonText?: string;
  checkPremium?: boolean;
}

const PageLayout = ({
  children,
  title,
  showNavigation = true,
  previousPage,
  nextPage,
  nextButtonText = "Next",
  previousButtonText = "Back",
  checkPremium = false,
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const { accessLevel } = useCostEstimation();

  const handleNext = () => {
    if (checkPremium && accessLevel === "basic") {
      navigate("/plans");
    } else if (nextPage) {
      navigate(nextPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            {title}
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
      <main className="flex-grow py-6 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>

      {/* Navigation Buttons */}
      {showNavigation && (
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between">
          {previousPage ? (
            <Button 
              variant="outline" 
              onClick={() => navigate(previousPage)}
            >
              {previousButtonText}
            </Button>
          ) : (
            <div></div>
          )}
          {nextPage && (
            <Button onClick={handleNext}>
              {checkPremium && accessLevel === "basic" 
                ? "Upgrade to Premium" 
                : nextButtonText}
            </Button>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t">
        <div className="max-w-7xl mx-auto flex justify-center items-center text-sm text-gray-500">
          <span>© NeuronWorks.AI & RAMWIN, All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
