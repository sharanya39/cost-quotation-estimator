
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Project Details", path: "/project-details" },
    { name: "Bill of Materials", path: "/bill-of-materials" },
    { name: "Human Intervention", path: "/human-intervention" },
    { name: "Engineering Drawings", path: "/engineering-drawings" },
    { name: "Extract Details", path: "/extract-details" },
    { name: "Material Cost", path: "/material-cost" },
    { name: "Manufacturing Cost", path: "/manufacturing-cost-1" },
    { name: "Production Cost", path: "/production-cost" },
    { name: "Should Cost", path: "/should-cost" },
    { name: "Quotation Cost", path: "/quotation-cost" },
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
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
