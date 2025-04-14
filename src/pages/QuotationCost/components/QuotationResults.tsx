
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/utils/calculations";

interface QuotationResultsProps {
  l5Costs: {
    l5CostPerKg: number;
    l5CostPerPiece: number;
    totalQuotationCost: number;
  };
}

const QuotationResults = ({ l5Costs }: QuotationResultsProps) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold mb-4 text-blue-800">Quotation Results</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Quotation Cost per kg</p>
          <p className="text-2xl font-bold text-blue-800">{formatINR(l5Costs.l5CostPerKg)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Quotation Cost per piece</p>
          <p className="text-2xl font-bold text-blue-800">{formatINR(l5Costs.l5CostPerPiece)}</p>
        </div>
        
        <div className="pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-500">Total Quotation Cost</p>
          <p className="text-3xl font-bold text-blue-800">{formatINR(l5Costs.totalQuotationCost)}</p>
        </div>
      </div>
    </div>
  );
};

export default QuotationResults;
