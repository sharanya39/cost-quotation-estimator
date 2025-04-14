
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/20d338de-3f52-45aa-9a44-6d0ebffb5843.png" 
            alt="Cost Estimator" 
            className="w-full max-w-md mx-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 max-w-4xl">
          Get quotes faster and smarter with our intuitive Cost Estimator.
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 mb-12">
          <img 
            src="/lovable-uploads/d967ca13-f60a-4f75-b7a6-54df8821c549.png" 
            alt="NeuronWorks.AI" 
            className="w-48"
          />
          <img 
            src="/lovable-uploads/4ab359a8-8389-45de-8eaa-0c3ba1cdb5fa.png" 
            alt="RAMWIN" 
            className="w-48"
          />
        </div>
        
        <p className="text-xl font-quote italic text-gray-700 mb-12 max-w-2xl">
          "Effortless Cost Estimation with AI – Simplifying Precision for Everyone."
        </p>
        
        <Button 
          size="lg" 
          className="text-lg px-10 py-6"
          onClick={() => navigate("/plans")}
        >
          Get Started
        </Button>
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

export default LandingPage;
