import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PackingInput } from "@/types/packing";
import { PlayCircle, FileJson } from "lucide-react";

interface JsonInputProps {
  onSubmit: (data: PackingInput) => void;
  isProcessing: boolean;
}

const DEFAULT_JSON = JSON.stringify(
  {
    container: {
      id: "container-1",
      width: 10,
      height: 10,
      depth: 10,
    },
    items: [
      { id: "item-1", name: "Box A", width: 3, height: 3, depth: 3 },
      { id: "item-2", name: "Box B", width: 2, height: 4, depth: 2 },
      { id: "item-3", name: "Box C", width: 5, height: 2, depth: 3 },
      { id: "item-4", name: "Box D", width: 2, height: 2, depth: 2 },
      { id: "item-5", name: "Box E", width: 4, height: 3, depth: 2 },
    ],
  },
  null,
  2
);

export function JsonInput({ onSubmit, isProcessing }: JsonInputProps) {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);

  const handleSubmit = () => {
    try {
      const data = JSON.parse(jsonInput);

      // Validate structure
      if (!data.container || !data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid JSON structure. Must have 'container' and 'items' array.");
      }

      // Validate container
      const { container } = data;
      if (!container.width || !container.height || !container.depth) {
        throw new Error("Container must have width, height, and depth.");
      }

      // Validate items
      for (const item of data.items) {
        if (!item.id || !item.name || !item.width || !item.height || !item.depth) {
          throw new Error("Each item must have id, name, width, height, and depth.");
        }
      }

      toast.success("JSON validated successfully!");
      onSubmit(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  const loadExample = () => {
    setJsonInput(DEFAULT_JSON);
    toast.info("Example data loaded");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Container & Items JSON</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadExample}
            disabled={isProcessing}
          >
            Load Example
          </Button>
        </div>

        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON data..."
          className="font-mono text-sm min-h-[300px]"
          disabled={isProcessing}
        />

        <Button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          {isProcessing ? "Processing..." : "Run Packing Algorithm"}
        </Button>
      </div>
    </Card>
  );
}
