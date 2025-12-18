import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton({ onExport, format = "CSV", disabled = false }) {
    const handleExport = () => {
        if (onExport) {
            onExport(format);
        } else {
            // Placeholder export functionality
            alert(`Export to ${format} functionality will be implemented with backend`);
        }
    };

    return (
        <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={disabled}
            className="gap-2"
        >
            <Download className="h-4 w-4" />
            Export {format}
        </Button>
    );
}
