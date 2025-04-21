
import React from 'react';

// Use your context/types as necessary to provide the table data.
interface QuotationSummaryTableProps {
  items: {
    partNumber: string;
    description: string;
    weight: number;
    quantity: number;
    l1Cost: number;
    l2Cost: number;
    l3Cost: number;
    l4Cost: number;
    l5Cost: number;
    totalPerPiece: number;
    freight: number;
  }[];
}

const QuotationSummaryTable: React.FC<QuotationSummaryTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm rounded-lg border border-green-100">
        <thead>
          <tr className="bg-green-50 text-green-900">
            <th className="font-semibold p-3 border border-green-100">S.No</th>
            <th className="font-semibold p-3 border border-green-100">Part Number</th>
            <th className="font-semibold p-3 border border-green-100">Description</th>
            <th className="font-semibold p-3 border border-green-100">Weight (kg)</th>
            <th className="font-semibold p-3 border border-green-100">Quantity</th>
            <th className="font-semibold p-3 border border-green-100">Quoted-L1 Cost/kg</th>
            <th className="font-semibold p-3 border border-green-100">Quoted-L2 Cost/kg</th>
            <th className="font-semibold p-3 border border-green-100">Quoted-L3 Cost/kg</th>
            <th className="font-semibold p-3 border border-green-100">Quoted-L4 Cost/kg</th>
            <th className="font-semibold p-3 border border-green-100">Quoted-L5 Cost/kg</th>
            <th className="font-semibold p-3 border border-green-100">Total Quoted-Cost/piece</th>
            <th className="font-semibold p-3 border border-green-100">Final-Quoted-Cost Freight</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={idx} className="even:bg-green-50">
              <td className="p-3 text-center border border-green-100">{idx + 1}</td>
              <td className="p-3 text-center border border-green-100">{row.partNumber}</td>
              <td className="p-3 border border-green-100">{row.description}</td>
              <td className="p-3 text-center border border-green-100">{row.weight}</td>
              <td className="p-3 text-center border border-green-100">{row.quantity}</td>
              <td className="p-3 text-center border border-green-100">{row.l1Cost}</td>
              <td className="p-3 text-center border border-green-100">{row.l2Cost}</td>
              <td className="p-3 text-center border border-green-100">{row.l3Cost}</td>
              <td className="p-3 text-center border border-green-100">{row.l4Cost}</td>
              <td className="p-3 text-center border border-green-100">{row.l5Cost}</td>
              <td className="p-3 text-center border border-green-100">{row.totalPerPiece}</td>
              <td className="p-3 text-center border border-green-100">{row.freight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default QuotationSummaryTable;
