import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Container } from "@/types/packing";
import { Box } from "lucide-react";

interface ContainerFormProps {
  container: Container;
  onUpdate: (container: Container) => void;
}

export function ContainerForm({ container, onUpdate }: ContainerFormProps) {
  const [dimensions, setDimensions] = useState({
    width: container.width,
    height: container.height,
    depth: container.depth,
  });

  const handleUpdate = () => {
    onUpdate({
      ...container,
      ...dimensions,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Container Dimensions</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-xs text-muted-foreground">
              Width
            </Label>
            <Input
              id="width"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-xs text-muted-foreground">
              Height
            </Label>
            <Input
              id="height"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depth" className="text-xs text-muted-foreground">
              Depth
            </Label>
            <Input
              id="depth"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.depth}
              onChange={(e) =>
                setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <Button onClick={handleUpdate} className="w-full" size="sm">
          Update Container
        </Button>
      </div>
    </Card>
  );
}
