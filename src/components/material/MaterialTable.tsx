
import { MaterialItem } from "@/contexts/CostEstimationContext";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MaterialTableRow from "./MaterialTableRow";

interface MaterialTableProps {
  items: MaterialItem[];
  onInputChange: (index: number, field: string, value: string | number) => void;
  onRemoveItem: (index: number) => void;
}

const MaterialTable = ({ items, onInputChange, onRemoveItem }: MaterialTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Item No.</TableHead>
            <TableHead className="w-32">Part Number</TableHead>
            <TableHead className="w-60">Item Description</TableHead>
            <TableHead className="w-32">Unit Weight (kg)</TableHead>
            <TableHead className="w-28">Quantity</TableHead>
            <TableHead className="w-36">Total Weight (kg)</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <MaterialTableRow
              key={index}
              item={item}
              index={index}
              onInputChange={onInputChange}
              onRemove={onRemoveItem}
              disabled={items.length <= 1}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaterialTable;
