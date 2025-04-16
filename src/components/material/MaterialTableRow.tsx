
import { MaterialItem } from "@/types/cost-estimation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface MaterialTableRowProps {
  item: MaterialItem;
  index: number;
  onInputChange: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}

const MaterialTableRow = ({ 
  item, 
  index, 
  onInputChange, 
  onRemove, 
  disabled 
}: MaterialTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{item.itemNumber}</TableCell>
      <TableCell>
        <Input
          value={item.itemPartNumber}
          onChange={(e) => onInputChange(index, "itemPartNumber", e.target.value)}
          placeholder="Part number"
        />
      </TableCell>
      <TableCell>
        <Input
          value={item.itemDescription}
          onChange={(e) => onInputChange(index, "itemDescription", e.target.value)}
          placeholder="Description"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.unitWeight}
          onChange={(e) => onInputChange(index, "unitWeight", Number(e.target.value))}
          placeholder="0.0"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onInputChange(index, "quantity", Number(e.target.value))}
          placeholder="0"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.totalWeight}
          readOnly
          placeholder="0.0"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default MaterialTableRow;
