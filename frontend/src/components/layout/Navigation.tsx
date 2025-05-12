
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useCostEstimation } from "@/contexts/CostEstimationContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessLevel } = useCostEstimation();
  
  const navItems = [
    { name: "Project Details", path: "/project-details" },
    { name: "Upload Engineering Diagram", path: "/upload-engineering-diagram" },
    { name: "Bill of Materials", path: "/bill-of-materials" },
    { name: "Human Intervention", path: "/human-intervention" },
    // { name: "Engineering Drawings", path: "/engineering-drawings" },
    { name: "Extract Details", path: "/extract-details" },
    // ...(accessLevel === "premium" ? [
      { name: "Material Cost", path: "/material-cost" },
      { name: "Manufacturing Cost", path: "/manufacturing-cost-1" },
      { name: "Production Cost", path: "/production-cost" },
      { name: "Should Cost", path: "/should-cost" },
      { name: "Quotation Cost", path: "/quotation-cost" },
      { name: "Final Quotation", path: "/final-quotation" },
    // ] : [])
  ];

  return (
    <div className="bg-[#F2FCE2] p-4 rounded-lg mb-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-[#4CAF50] text-white"
                : "bg-white text-gray-700 hover:bg-[#E8F5E9]"
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
