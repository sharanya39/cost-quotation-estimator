
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { formatINR } from "@/utils/calculations";
import { CostBreakdown } from "@/contexts/CostEstimationContext";

interface CostSummaryTableProps {
  existingBreakdown: CostBreakdown;
  l5Costs: {
    l5CostPerKg: number;
    l5CostPerPiece: number;
    totalQuotationCost: number;
  };
  quantity: number;
}

const CostSummaryTable = ({ existingBreakdown, l5Costs, quantity }: CostSummaryTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Summary</CardTitle>
        <CardDescription>Complete Cost Breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Level</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Kg</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Piece</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">L1 (Material)</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l1CostPerKg || 0)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l1CostPerPiece || 0)}</td>
                <td className="px-4 py-2">Raw material cost with waste and firm price adjustments</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">L2 (Manufacturing)</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l2CostPerKg || 0)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l2CostPerPiece || 0)}</td>
                <td className="px-4 py-2">Processing, overheads, and related costs</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">L3 (Production)</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l3CostPerKg || 0)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l3CostPerPiece || 0)}</td>
                <td className="px-4 py-2">Total production cost (L1 + L2)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap">L4 (Should Cost)</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l4CostPerKg || 0)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatINR(existingBreakdown.l4CostPerPiece || 0)}</td>
                <td className="px-4 py-2">Production cost with commercial overheads</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-2 whitespace-nowrap font-medium">L5 (Quotation)</td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">{formatINR(l5Costs.l5CostPerKg)}</td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">{formatINR(l5Costs.l5CostPerPiece)}</td>
                <td className="px-4 py-2">Final quotation price with profit and freight</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Total Quotation Cost for {quantity} pieces: <span className="font-bold">{formatINR(l5Costs.totalQuotationCost)}</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default CostSummaryTable;
