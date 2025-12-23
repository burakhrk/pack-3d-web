import { Button } from "@/components/ui/button";
import { Download, Camera, FileText } from "lucide-react";
import { PackingResult } from "@/types/packing";
import { toast } from "sonner";

interface ExportActionsProps {
    result: PackingResult | null;
    onCaptureScreenshot: () => void;
}

export function ExportActions({ result, onCaptureScreenshot }: ExportActionsProps) {
    const downloadCSV = () => {
        if (!result || result.packedItems.length === 0) {
            toast.error("No packed items to export");
            return;
        }

        const headers = ["ID", "Name", "Width (cm)", "Height (cm)", "Depth (cm)", "Volume (m³)", "X (cm)", "Y (cm)", "Z (cm)", "Weight (kg)"];
        const rows = result.packedItems.map((item) => [
            item.id,
            item.name,
            item.width,
            item.height,
            item.depth,
            (item.width * item.height * item.depth / 1000000).toFixed(6),
            item.position.x,
            item.position.y,
            item.position.z,
            item.weight || 0,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `packing_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("CSV Report downloaded");
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={downloadCSV}
                disabled={!result || result.packedItems.length === 0}
                title="Download CSV Report"
            >
                <FileText className="h-4 w-4 mr-2" />
                CSV Report
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={onCaptureScreenshot}
                disabled={!result}
                title="Capture Screenshot"
            >
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
            </Button>
        </div>
    );
}
