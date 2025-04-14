
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatINR } from "@/utils/calculations";
import { useCostEstimation } from "@/contexts/CostEstimationContext";

const QuotationFormula = () => {
  const { humanIntervention, costBreakdowns, currentItemIndex } = useCostEstimation();
  const existingBreakdown = costBreakdowns[currentItemIndex] || { l4CostPerKg: 0 };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Quotation Cost Formula</CardTitle>
        <CardDescription>L5 = L4 × (1 + Profit Margin % + Negotiation %) + Freight per kg</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Input Parameters</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Should Cost (L4):</div>
                <div>{formatINR(existingBreakdown.l4CostPerKg || 0)} per kg</div>
                
                <div className="text-sm font-medium">Profit Margin:</div>
                <div>{humanIntervention.profitMarginPercentage}%</div>
                
                <div className="text-sm font-medium">Negotiation Margin:</div>
                <div>{humanIntervention.negotiationPercentage}%</div>
                
                <div className="text-sm font-medium">Freight per kg:</div>
                <div>{formatINR(humanIntervention.freightPerKg)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationFormula;
