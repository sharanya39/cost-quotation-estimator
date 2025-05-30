
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onStartNew: () => void;
  onGoToBOM: () => void;
  onNextItem: () => void;
  onDownload: () => void;
  isLastItem: boolean;
}

const ActionButtons = ({
  onStartNew,
  onGoToBOM,
  onNextItem,
  onDownload,
  isLastItem
}: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="space-x-2">
        <Button 
          onClick={onStartNew}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Estimation
        </Button>
        
        <Button 
          onClick={onGoToBOM}
          variant="outline"
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          Edit Items in BOM
        </Button>
      </div>
      
      <div className="space-x-2">
        <Button 
          onClick={onNextItem}
          disabled={isLastItem}
          className="flex items-center bg-[#00BFB3] hover:bg-[#00BFB3]/90"
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          {isLastItem ? 'Go to Final Quotation' : 'Estimate Next Item'}
        </Button>
        
        <Button 
          onClick={onDownload}
          className="flex items-center"
          variant="secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Excel Report
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
